import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLeadSourceDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  url: string;

  @IsOptional()
  status: string;
}
