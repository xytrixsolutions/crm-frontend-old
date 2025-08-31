import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLeadActionDto {
  @IsNotEmpty()
  status: string;

  @IsOptional()
  userId: number;

  @IsOptional()
  leadId: number;
}
