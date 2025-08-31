import { IsOptional, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateVatDto {
  @IsPositive()
  @IsNotEmpty()
  vatPercent: number;

  @IsOptional()
  status?: string;

  @IsOptional()
  userId?: number;
}
