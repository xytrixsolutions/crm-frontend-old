import { IsOptional, IsNumber } from 'class-validator';

export class CreateBusinessPackageDto {
  @IsNumber()
  businessId: number;

  @IsNumber()
  packageId: number;

  @IsOptional()
  leadUsed?: number;

  @IsOptional()
  expiresAt?: number;

  @IsOptional()
  status?: string;
}
