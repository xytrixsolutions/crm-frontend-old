import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateLeadDto {
  @IsOptional()
  vehicleModel?: string;

  @IsOptional()
  vehicleYear?: string;

  @IsOptional()
  vehicleSeries?: string;

  @IsOptional()
  vehiclePart?: string;

  @IsOptional()
  vehicleBrand?: string;

  @IsOptional()
  vehicleTitle?: string;

  @IsOptional()
  vrm: string;

  @IsOptional()
  partSupplied: string;

  @IsOptional()
  supplyOnly: string;

  @IsOptional()
  considerBoth: string;

  @IsOptional()
  reconditionedCondition: string;

  @IsOptional()
  usedCondition: string;

  @IsOptional()
  newCondition: string;

  @IsOptional()
  considerAllCondition: string;

  @IsOptional()
  vehicleDrive: string;

  @IsOptional()
  collectionRequired: string;

  @IsNotEmpty()
  postcode: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  email: string;

  @IsString()
  name: string;

  @IsString()
  number: string;
}
