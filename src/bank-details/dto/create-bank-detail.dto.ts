import { IsOptional, IsNotEmpty } from 'class-validator';

export class CreateBankDetailDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  sortCode: string;

  @IsNotEmpty()
  accountNumber: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  businessProfileId?: number;
}
