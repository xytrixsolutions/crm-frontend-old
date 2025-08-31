import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BankDetail } from './entities/bank-detail.entity';
import { BusinessProfileService } from '../business-profile/business-profile.service';
import { Repository } from 'typeorm';
import { CustomException } from '../common/exceptions/custom-exception';
import { Status } from '../common/enums/status.enum';

@Injectable()
export class BankDetailsService {
  constructor(
    @InjectRepository(BankDetail)
    private bankDetailRepository: Repository<BankDetail>,
    private readonly businessProfileService: BusinessProfileService,
  ) {}

  async create(createBankDetailDto: CreateBankDetailDto, userId: number) {
    const businessProfile =
      await this.businessProfileService.findOneByUserId(userId);

    if (!businessProfile) {
      throw new CustomException(
        'Business profile not found for the user. Please create a business profile first.',
        HttpStatus.NOT_FOUND,
      );
    }

    const bankDetails = this.bankDetailRepository.create({
      ...createBankDetailDto,
      businessProfile: businessProfile,
      status: Status.ACTIVE,
    });

    const savedBankDetails = await this.bankDetailRepository.save(bankDetails);

    const { id, name, accountNumber, sortCode, createdAt, updatedAt } =
      savedBankDetails;
    return {
      id,
      name,
      accountNumber,
      sortCode,
      status: savedBankDetails.status,
      createdAt,
      updatedAt,
    };
  }

  findAll() {
    return `This action returns all bankDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bankDetail`;
  }

  async update(id: number, updateBankDetailDto: UpdateBankDetailDto) {
    const bankDetails = await this.bankDetailRepository.preload({
      id,
      ...updateBankDetailDto,
    });

    if (!bankDetails) {
      throw new CustomException('Bank details not found', HttpStatus.NOT_FOUND);
    }

    return await this.bankDetailRepository.save(bankDetails);
  }

  remove(id: number) {
    return `This action removes a #${id} bankDetail`;
  }
}
