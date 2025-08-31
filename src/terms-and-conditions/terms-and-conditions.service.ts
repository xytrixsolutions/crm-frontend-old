import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTermsAndConditionDto } from './dto/create-terms-and-condition.dto';
import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TermsAndCondition } from './entities/terms-and-condition.entity';
import { Repository } from 'typeorm';
import { Status } from '../common/enums/status.enum';
import { BusinessProfileService } from '../business-profile/business-profile.service';
import { CustomException } from '../common/exceptions/custom-exception';

@Injectable()
export class TermsAndConditionsService {
  constructor(
    @InjectRepository(TermsAndCondition)
    private termsRepository: Repository<TermsAndCondition>,
    private readonly businessProfileService: BusinessProfileService,
  ) {}

  async create(
    createTermsAndConditionDto: CreateTermsAndConditionDto,
    userId: number,
  ) {
    const businessProfile =
      await this.businessProfileService.findOneByUserId(userId);

    if (!businessProfile) {
      throw new CustomException(
        'Business profile not found for the user. Please create a business profile first.',
        HttpStatus.NOT_FOUND,
      );
    }

    const newTerms = this.termsRepository.create({
      ...createTermsAndConditionDto,
      businessProfile: businessProfile,
      status: Status.ACTIVE,
    });
    const savedTerms = await this.termsRepository.save(newTerms);

    await this.businessProfileService.update(businessProfile.id, {
      completed: true,
    });

    const {
      id,
      saleTerms,
      warrantyTerms,
      quotationTerms,
      createdAt,
      updatedAt,
    } = savedTerms;

    return {
      id,
      saleTerms,
      warrantyTerms,
      quotationTerms,
      createdAt,
      updatedAt,
    };
  }

  findAll() {
    return `This action returns all termsAndConditions`;
  }

  async findOneByBusinessId(businessId: number) {
    return await this.termsRepository.findOneByOrFail({
      businessProfile: { id: businessId },
    });
  }

  async update(
    id: number,
    updateTermsAndConditionDto: UpdateTermsAndConditionDto,
  ) {
    const terms = await this.termsRepository.preload({
      id,
      ...updateTermsAndConditionDto,
    });

    if (!terms) {
      throw new CustomException(
        'Terms and conditions not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.termsRepository.save(terms);
  }

  remove(id: number) {
    return `This action removes a #${id} termsAndCondition`;
  }
}
