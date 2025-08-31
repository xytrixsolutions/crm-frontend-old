/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UserService } from '../user/user.service';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessProfile } from './entities/business-profile.entity';
import { Repository } from 'typeorm';
import { UserBusinessProfile } from './interfaces/business-profile.interface';
import { CustomException } from '../common/exceptions/custom-exception';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { S3Uploader } from '../common/helpers/uploadFile';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BusinessProfileService {
  private uploader: S3Uploader;

  constructor(
    @InjectRepository(BusinessProfile)
    private readonly businessProfileRepository: Repository<BusinessProfile>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.uploader = new S3Uploader(this.configService);
  }

  async create(
    createBusinessProfileDto: UserBusinessProfile,
  ): Promise<BusinessProfile> {
    const user = await this.userService.findOneById(
      createBusinessProfileDto.userId,
    );
    if (!user) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }

    const { logo, ...restData } = createBusinessProfileDto;
    let uploadedLogoUrl: string | undefined;

    if (
      logo &&
      typeof logo === 'object' &&
      'buffer' in logo &&
      'originalname' in logo &&
      'mimetype' in logo
    ) {
      const { buffer, mimetype } = logo;

      const result = await this.uploader.upload(
        buffer,
        this.configService.get<string>('AWS_S3_BUCKET')!,
        `${this.configService.get<string>('NODE_ENV')!}/${Date.now().toString()}.${logo.originalname.split('.').pop()}`,
        mimetype,
      );

      uploadedLogoUrl = result.Location;
    }

    const businessProfile = this.businessProfileRepository.create({
      ...restData,
      user,
      logo: uploadedLogoUrl,
    });

    return await this.businessProfileRepository.save(businessProfile);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<BusinessProfile>> {
    return paginate(query, this.businessProfileRepository, {
      sortableColumns: ['id', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['updatedAt', 'DESC']],
      searchableColumns: [
        'businessName',
        'primaryPhone',
        'alternatePhone',
        'vatNumber',
      ],
      filterableColumns: {
        quotingPersonName: [FilterOperator.EQ, FilterSuffix.NOT],
        businessType: [FilterOperator.EQ, FilterSuffix.NOT],
        city: [FilterOperator.EQ, FilterSuffix.NOT],
        country: [FilterOperator.EQ, FilterSuffix.NOT],
        postCode: [FilterOperator.EQ, FilterSuffix.NOT],
        defaultWarranty: [FilterOperator.EQ, FilterSuffix.NOT],
        userId: [FilterOperator.EQ, FilterSuffix.NOT],
      },
      relations: ['user'],
    });
  }

  async findOneById(id: number): Promise<BusinessProfile | null> {
    const businessProfile = await this.businessProfileRepository.findOne({
      where: { id },
      relations: ['termsAndConditions', 'bankDetails', 'user'],
    });

    if (!businessProfile) {
      throw new CustomException(
        'Business Profile not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return businessProfile;
  }

  async findOneByUserId(userId: number): Promise<BusinessProfile | null> {
    const businessProfile = await this.businessProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['termsAndConditions', 'bankDetails', 'user'],
    });

    if (!businessProfile) {
      throw new CustomException(
        'Business Profile not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return businessProfile;
  }

  async update(id: number, updateBusinessProfileDto: UpdateBusinessProfileDto) {
    const { logo, ...resData } = updateBusinessProfileDto;

    let res;
    if (
      logo &&
      typeof logo === 'object' &&
      'buffer' in logo &&
      'originalname' in logo &&
      'mimetype' in logo
    ) {
      res = await this.uploader.upload(
        (logo as { buffer: Buffer }).buffer,
        this.configService.get<string>('AWS_S3_BUCKET')!,
        `${this.configService.get<string>('NODE_ENV')!}/${Date.now().toString()}.${logo?.originalname?.split('.')?.pop()}`,
        (logo as { mimetype: string }).mimetype,
      );
    }

    const businessProfile = await this.businessProfileRepository.preload({
      ...resData,
      id,
      logo: res?.Location,
      vatEnabled: Boolean(resData.vatEnabled),
    });

    if (!businessProfile) {
      throw new CustomException(
        'Business Profile not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.businessProfileRepository.save(businessProfile);
  }

  async remove(id: number) {
    const businessProfile = await this.businessProfileRepository.findOneBy({
      id,
    });

    if (!businessProfile) {
      throw new CustomException(
        'Business Profile not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.businessProfileRepository.delete(id);
  }
}
