import { IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePackageDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  leadLimit: number;

  @IsOptional()
  status?: string;
}
