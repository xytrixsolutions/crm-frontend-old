import { IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTermsAndConditionDto {
  @IsNotEmpty()
  saleTerms: string;

  @IsNotEmpty()
  quotationTerms: string;

  @IsNotEmpty()
  warrantyTerms: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  businessProfileId?: number;
}
