/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { Status } from '../common/enums/status.enum';
import { LeadSource } from './entities/lead-source.entity';
import { CustomException } from '../common/exceptions/custom-exception';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { CreateLeadSourceDto } from './dto/create-lead-source.dto';
import { VehicleDetail } from './entities/vehicle-detail.entity';
import { ConfigService } from '@nestjs/config';
import { VehicleDetailInterface } from './interfaces/vehicle-detail.interface';
import { CreateLeadActionDto } from './dto/create-lead-action.dto';
import { LeadAction } from './entities/lead-action.entity';
import { UserService } from '../user/user.service';
import { UpdateLeadActionDto } from './dto/update-lead-action.dto';
import { NotificationService } from 'src/notification/notification.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(LeadSource)
    private leadSourceRepository: Repository<LeadSource>,
    @InjectRepository(VehicleDetail)
    private vehicleDetailRepository: Repository<VehicleDetail>,
    @InjectRepository(LeadAction)
    private leadActionRepository: Repository<LeadAction>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createLeadDto: CreateLeadDto,
    host: string,
  ): Promise<VehicleDetailInterface> {
    const existingHost = await this.leadSourceRepository.findOne({
      where: { url: host },
    });

    if (!existingHost) {
      throw new CustomException(
        `Host ${host} is not allowed.`,
        HttpStatus.FORBIDDEN,
      );
    }

    let vehicleDetail: VehicleDetail | null = null;
    const vrm = createLeadDto.vrm;

    if (vrm) {
      vehicleDetail = await this.vehicleDetailRepository.findOne({
        where: { vrm: vrm },
      });

      if (!vehicleDetail || !vehicleDetail.basicData) {
        const basicApiUrl =
          this.configService.get<string>('BASIC_DETAILS_API')!;
        const apiKey = this.configService.get<string>('DETAILS_API_KEY')!;

        const basicResponse = await fetch(
          `${basicApiUrl}?apikey=${apiKey}&vrm=${encodeURIComponent(vrm)}`,
        );
        const basicData = await basicResponse.json();

        if (!basicData || 'message' in basicData) {
          throw new CustomException(
            `Basic vehicle data not found for VRM ${vrm}`,
            HttpStatus.NOT_FOUND,
          );
        }

        if (!vehicleDetail) {
          vehicleDetail = this.vehicleDetailRepository.create({
            vrm,
            basicData,
          });

          await this.vehicleDetailRepository.save(vehicleDetail);
        } else {
          vehicleDetail.basicData = basicData;
          await this.vehicleDetailRepository.save(vehicleDetail);
        }
      }
    }

    const lead = this.leadRepository.create({
      ...createLeadDto,
      status: Status.NEW,
      leadSource: existingHost,
    });

    const savedLead = await this.leadRepository.save(lead);

    const tokens = await this.authService.findAllTokens();

    for (const token of tokens) {
      if (!token.deviceToken) continue;
      await this.notificationService.sendNotification({
        token: token.deviceToken,
        title: 'New Lead Created',
        body: `A new lead has been created with ID: ${savedLead.id}`,
        icon: this.configService.get<string>('LOGO_URL')!,
        userId: token.user.id,
      });
    }

    const { vehicleDetail: _, ...leadData } = savedLead as any;

    return {
      ...leadData,
      details: vehicleDetail,
    };
  }

  async findAll(
    query: PaginateQuery,
    userId?: number,
  ): Promise<Paginated<Lead>> {
    let queryBuilder = this.leadRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.leadSource', 'leadSource')
      .leftJoinAndSelect(
        'lead.leadActions',
        'leadActions',
        'leadActions.user_id = :userId',
        { userId },
      )
      .orderBy('lead.updatedAt', 'DESC');

    const dateRange = query.filter?.dateRange as string;
    const statusFilter = query.filter?.status;
    if (dateRange) {
      queryBuilder = queryBuilder.where(
        'lead.createdAt BETWEEN :start AND :end',
        {
          start: dateRange.split(',')[0],
          end: dateRange.split(',')[1],
        },
      );
    }

    if (statusFilter) {
      if (statusFilter === 'NEW') {
        queryBuilder = queryBuilder.andWhere('leadActions.id is null');
      } else {
        queryBuilder = queryBuilder.andWhere('leadActions.status = :status', {
          status: statusFilter,
        });
      }
      delete query?.filter?.status;
    }

    const result = await paginate(query, queryBuilder, {
      sortableColumns: ['id', 'createdAt', 'updatedAt'],
      searchableColumns: ['name', 'email', 'number'],
    });

    result.data = result.data.map((lead) => {
      const { leadActions, ...rest } = lead;
      return {
        ...rest,
        action: leadActions?.[0] || null,
      };
    }) as any;

    return result;
  }

  async findOne(id: number, userId: number): Promise<VehicleDetailInterface> {
    const lead = await this.leadRepository.findOne({
      where: { id },
    });

    if (!lead) {
      throw new CustomException('Lead not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }

    let leadAction = await this.leadActionRepository.findOne({
      where: { lead: lead, user: user },
    });

    if (!leadAction) {
      leadAction = this.leadActionRepository.create({
        status: Status.VIEWED,
        user: user,
        lead: lead,
      });
      await this.leadActionRepository.save(leadAction);
    }

    let vehicleDetail;
    const vrm = lead.vrm;

    if (vrm) {
      vehicleDetail = await this.vehicleDetailRepository.findOne({
        where: { vrm: vrm },
      });
    }

    const {
      vehicleDetail: _vehicleDetail,
      leadAction: _leadAction,
      ...leadData
    } = lead as any;

    const { lead: _lead, user: _user, ...action } = leadAction;

    return {
      ...leadData,
      details: vehicleDetail,
      action: {
        ...action,
      },
    };
  }

  async findOneById(id: number): Promise<Lead | null> {
    const lead = await this.leadRepository.findOneBy({ id });

    if (!lead) {
      throw new CustomException('Lead not found', HttpStatus.NOT_FOUND);
    }

    return lead;
  }

  async vehicleDetails(vrm: string) {
    let vehicleDetail: VehicleDetail | null = null;

    if (vrm) {
      vehicleDetail = await this.vehicleDetailRepository.findOne({
        where: { vrm: vrm },
      });

      if (!vehicleDetail || !vehicleDetail.detailedData) {
        const detailedApiUrl =
          this.configService.get<string>('EXTRA_DETAILS_API')!;
        const apiKey = this.configService.get<string>('DETAILS_API_KEY')!;

        const detailedResponse = await fetch(
          `${detailedApiUrl}?apikey=${apiKey}&vrm=${encodeURIComponent(vrm)}`,
        );
        const detailedData = await detailedResponse.json();

        if (!detailedData || 'message' in detailedData) {
          throw new CustomException(
            `Detailed vehicle data not found for VRM ${vrm}`,
            HttpStatus.NOT_FOUND,
          );
        }

        if (!vehicleDetail) {
          vehicleDetail = this.vehicleDetailRepository.create({
            vrm,
            detailedData,
          });

          await this.vehicleDetailRepository.save(vehicleDetail);
        } else {
          vehicleDetail.detailedData = detailedData;
          await this.vehicleDetailRepository.save(vehicleDetail);
        }
      }
    }

    return vehicleDetail;
  }

  async update(id: number, updateLeadDto: UpdateLeadDto) {
    const lead = await this.leadRepository.preload({
      id,
      ...updateLeadDto,
    });

    if (!lead) {
      throw new CustomException('Lead not found', HttpStatus.NOT_FOUND);
    }

    return await this.leadRepository.save(lead);
  }

  async remove(id: number) {
    const lead = await this.leadRepository.findOneBy({ id });

    if (!lead) {
      throw new CustomException('Lead not found', HttpStatus.NOT_FOUND);
    }

    return this.leadRepository.delete(id);
  }

  async createLeadSource(createLeadSourceDto: CreateLeadSourceDto) {
    const lead = this.leadSourceRepository.create({
      ...createLeadSourceDto,
      status: Status.ACTIVE,
    });
    return await this.leadSourceRepository.save(lead);
  }

  async createLeadAction(createLeadActionDto: CreateLeadActionDto) {
    const user = await this.userService.findOneById(createLeadActionDto.userId);
    const lead = await this.leadRepository.findOne({
      where: { id: createLeadActionDto.leadId },
    });
    if (!user) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!lead) {
      throw new CustomException('Lead not found', HttpStatus.NOT_FOUND);
    }

    let leadAction = await this.leadActionRepository.findOne({
      where: { lead: { id: lead.id }, user: { id: user.id } },
    });

    if (leadAction) {
      leadAction.status = createLeadActionDto.status;
      return await this.leadActionRepository.save(leadAction);
    } else {
      leadAction = this.leadActionRepository.create({
        ...createLeadActionDto,
        user: user,
        lead: lead,
      });
      return await this.leadActionRepository.save(leadAction);
    }
  }

  async updateLeadAction(id: number, updateLeadActionDto: UpdateLeadActionDto) {
    const leadAction = await this.leadActionRepository.preload({
      id,
      ...updateLeadActionDto,
    });

    if (!leadAction) {
      throw new CustomException('Lead action not found', HttpStatus.NOT_FOUND);
    }

    return await this.leadActionRepository.save(leadAction);
  }

  async findLeadAction(leadId: number, userId: number) {
    const leadAction = await this.leadActionRepository.findOne({
      where: { lead: { id: leadId }, user: { id: userId } },
    });

    return leadAction;
  }

  async findAllSources(query: PaginateQuery): Promise<Paginated<LeadSource>> {
    return paginate(query, this.leadSourceRepository, {
      sortableColumns: ['id', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['updatedAt', 'DESC']],
      searchableColumns: ['name', 'url'],
      filterableColumns: {
        status: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async countLeads(userId?: number): Promise<any> {
    const userLeads = await this.leadActionRepository
      .createQueryBuilder('leadAction')
      .where('leadAction.user_id = :userId', { userId })
      .select('COUNT(DISTINCT leadAction.lead_id)')
      .getRawOne()
      .then((result) => parseInt(result.count, 10) || 0);

    const actionCounts = await this.leadActionRepository
      .createQueryBuilder('action')
      .select('action.status', 'status')
      .addSelect('COUNT(action.id)', 'count')
      .addSelect('action.user_id', 'userId')
      .groupBy('action.status, action.user_id')
      .getRawMany();

    const getCount = (status: string, counts: any[]) =>
      parseInt(counts.find((c) => c.status === status)?.count || 0, 10) || 0;

    const monthlyLeadsGraphData = await this.leadActionRepository.query(
      `
        WITH months AS (
          SELECT generate_series(1, 12) AS month
        ),
        action_counts AS (
          SELECT
            EXTRACT(MONTH FROM TO_TIMESTAMP(leadAction.created_at / 1000))::INT AS action_month,
            leadAction.status,
            COUNT(DISTINCT leadAction.lead_id)::INT AS count
          FROM lead_actions leadAction
          WHERE leadAction.user_id = $1
          GROUP BY action_month, leadAction.status
        ),
        leads_counts AS (
          SELECT
            EXTRACT(MONTH FROM TO_TIMESTAMP(leads.created_at / 1000))::INT AS lead_month,
            COUNT(DISTINCT leads.id)::INT AS count
          FROM leads
          WHERE leads.status = 'NEW'
          GROUP BY lead_month
        )
        SELECT
          m.month,
          COALESCE(lc.count, 0)::INT AS newCount,
          COALESCE(SUM(CASE WHEN ac.status = 'VIEWED' THEN ac.count ELSE 0 END), 0)::INT AS viewedCount,
          COALESCE(SUM(CASE WHEN ac.status = 'QUOTATION' THEN ac.count ELSE 0 END), 0)::INT AS quotedCount,
          COALESCE(SUM(CASE WHEN ac.status = 'INVOICE' THEN ac.count ELSE 0 END), 0)::INT AS convertedCount
        FROM months m
        LEFT JOIN action_counts ac ON ac.action_month = m.month
        LEFT JOIN leads_counts lc ON lc.lead_month = m.month
        GROUP BY m.month, lc.count
        ORDER BY m.month;
      `,
      [userId],
    );

    const totalLeads = await this.leadRepository.count();
    const totalNewLeads = totalLeads - userLeads;
    const totalViewedLeads = getCount(Status.VIEWED, actionCounts);
    const totalContactedLeads = getCount(Status.QUOTATION, actionCounts);
    const totalConvertedLeads = getCount(Status.INVOICE, actionCounts);
    const totalExpiredLeads = getCount(Status.EXPIRED, actionCounts);
    const totalIgnoredLeads = getCount(Status.IGNORED, actionCounts);

    const percentages = {
      converted:
        Number(((totalConvertedLeads * 100) / totalLeads).toFixed(2)) || 0,
      new: Number(((totalNewLeads * 100) / totalLeads).toFixed(2)) || 0,
      viewed: Number(((totalViewedLeads * 100) / totalLeads).toFixed(2)) || 0,
      quoted:
        Number(((totalContactedLeads * 100) / totalLeads).toFixed(2)) || 0,
    };

    return {
      totalLeads,
      totalNewLeads,
      totalViewedLeads,
      totalContactedLeads,
      totalConvertedLeads,
      totalExpiredLeads,
      totalIgnoredLeads,
      percentages,
      monthlyLeadsGraphData,
    };
  }

  async findAllLeadActions(): Promise<LeadAction[] | null> {
    return await this.leadActionRepository.find();
  }
}
