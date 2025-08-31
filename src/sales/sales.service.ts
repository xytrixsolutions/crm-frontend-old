/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Repository } from 'typeorm';
import { SaleItem } from './entities/sale-item.entity';
import { EmailService } from '../email/email.service';
import { LeadsService } from '../leads/leads.service';
import { CustomException } from '../common/exceptions/custom-exception';
import { BusinessProfileService } from '../business-profile/business-profile.service';
import { Vat } from '../admin/entities/vat.entity';
import { SaleType } from '../common/enums/sale-type.enum';
import { EmailType } from '../common/enums/email-type.enum';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { ModelType } from '../common/enums/model-type.enum';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private readonly saleItemRepository: Repository<SaleItem>,
    @InjectRepository(Vat)
    private readonly vatRepository: Repository<Vat>,
    private readonly emailService: EmailService,
    private readonly leadService: LeadsService,
    private readonly businessService: BusinessProfileService,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const lead = await this.leadService.findOneById(createSaleDto.leadId);
    if (!lead) {
      throw new CustomException('Lead not found', HttpStatus.NOT_FOUND);
    }

    const company = await this.businessService.findOneByUserId(
      createSaleDto.userId!,
    );
    if (!company) {
      throw new CustomException('Business not found', HttpStatus.NOT_FOUND);
    }

    let invoiceNumber = createSaleDto?.invoiceNumber;
    if (invoiceNumber) {
      const existingSale = await this.saleRepository.findOne({
        where: {
          invoiceNumber: invoiceNumber,
          type: createSaleDto.type,
        },
      });
      if (existingSale) {
        throw new CustomException(
          'Invoice number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      const result = await this.saleRepository
        .createQueryBuilder('sale')
        .select('MAX(sale.invoice_number)', 'max')
        .where('sale.type = :type', { type: createSaleDto.type })
        .getRawOne();

      invoiceNumber = result?.max ? Number(result.max) + 1 : 1;
    }

    const terms = company?.termsAndConditions;
    const bankDetails = company?.bankDetails;

    const vat = await this.vatRepository.find();
    const leadAction = await this.leadService.findLeadAction(
      lead.id,
      company?.user?.id,
    );

    const sub = createSaleDto.subTotal;
    const tax = company?.vatEnabled ? (vat[0]?.vatPercent * sub) / 100 : 0;
    const total = sub + tax;

    let saleObj;
    let sale;
    let saleItems;

    if (!createSaleDto?.preview) {
      saleObj = this.saleRepository.create({
        ...createSaleDto,
        invoiceNumber: invoiceNumber,
        total: total,
        vatPercent: company?.vatEnabled ? vat[0]?.vatPercent : 0,
        lead,
        user: company?.user,
      });
      sale = await this.saleRepository.save(saleObj);

      if (
        sale &&
        createSaleDto.lineItems &&
        createSaleDto.lineItems.length > 0
      ) {
        saleItems = createSaleDto.lineItems.map((item) => {
          const saleItem = this.saleItemRepository.create({
            ...item,
            sale: sale,
          });
          return saleItem;
        });
        await this.saleItemRepository.save(saleItems);
      }
    }

    const res = await this.emailService.sendMail(
      {
        email: lead.email,
        subject: `Sale Confirmation for ${createSaleDto.type?.substring(0, 3)}-${sale?.invoiceNumber || invoiceNumber}`,
        type: createSaleDto.type as string as EmailType,
        leadId: leadAction?.id,
        modelId: sale?.id ?? 0,
        modelType: ModelType.SALE,
        context: {
          issueDate: new Date(Number(lead.createdAt)).toLocaleDateString(),
          invoiceDate: new Date().toLocaleDateString(),
          invoiceNumber: `${createSaleDto.type?.substring(0, 3)}-${sale?.invoiceNumber || invoiceNumber}`,
          note: createSaleDto.note,
          vehicle: {
            make: lead.vehicleBrand,
            model: lead.vehicleModel,
            year: lead.vehicleYear,
            reg: lead.vrm || lead.vehicleYear,
          },
          client: {
            name: lead.name,
            phone: lead.number,
            email: lead.email,
            address: lead.postcode,
          },
          company: {
            name: company?.businessName,
            username: company?.quotingPersonName,
            phone: company?.primaryPhone,
            email: company?.user?.email,
            address: company?.streetAddress,
            logo: company?.logo,
          },
          amountDue: `$${total}`,
          bankDetails: {
            exists: company?.bankDetails !== null,
            name: bankDetails?.name,
            sortCode: bankDetails?.sortCode,
            accountNumber: bankDetails?.accountNumber,
          },
          totals: {
            subTotal: sub,
            vat: company?.vatEnabled ? vat[0]?.vatPercent : 0,
            taxAmount: `$${tax}`,
            total: `$${total}`,
          },
          items: createSaleDto.preview ? saleItems : createSaleDto.lineItems,
          terms:
            createSaleDto.type === SaleType.INVOICE
              ? terms.saleTerms
              : terms.quotationTerms,
          signature: {
            name: company?.user?.name,
            title: 'Director',
          },
        },
      },
      createSaleDto.userId!,
      createSaleDto.preview,
    );

    return createSaleDto.preview ? res : sale;
  }

  async findAll(
    query: PaginateQuery,
    userId?: number,
  ): Promise<Paginated<Sale>> {
    const queryBuilder = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.saleItems', 'saleItems')
      .leftJoinAndSelect('sale.lead', 'lead');
    if (userId) {
      queryBuilder.where('sale.user.id = :userId', { userId });
    }
    if (query.filter?.leadId) {
      queryBuilder.where('sale.lead.id = :leadId', {
        leadId: query.filter?.leadId,
      });
    }
    return paginate(query, queryBuilder, {
      nullSort: 'last',
      defaultSortBy: [['updatedAt', 'DESC']],
      sortableColumns: ['id', 'createdAt', 'updatedAt'],
      searchableColumns: ['invoiceNumber'],
      filterableColumns: {
        status: [FilterOperator.EQ, FilterSuffix.NOT],
        type: [FilterOperator.EQ, FilterSuffix.NOT],
        engineType: [FilterOperator.EQ, FilterSuffix.NOT],
        'lead.id as leadId': [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async generateNextInvoiceNumber(type: SaleType): Promise<number> {
    const result = await this.saleRepository
      .createQueryBuilder('sale')
      .select('MAX(sale.invoice_number)', 'max')
      .where('sale.type = :type', { type })
      .getRawOne();

    const nextNumber = result?.max ? Number(result.max) + 1 : 1;
    return nextNumber;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale ${JSON.stringify(updateSaleDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
