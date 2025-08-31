import { PartialType } from '@nestjs/mapped-types';
import { CreateTermsAndConditionDto } from './create-terms-and-condition.dto';

export class UpdateTermsAndConditionDto extends PartialType(
  CreateTermsAndConditionDto,
) {}
