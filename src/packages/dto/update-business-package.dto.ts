import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessPackageDto } from './create-business-package.dto';

export class UpdateBusinessPackageDto extends PartialType(
  CreateBusinessPackageDto,
) {}
