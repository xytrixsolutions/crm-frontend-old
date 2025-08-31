import {
  IsOptional,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsObject,
  IsEnum,
} from 'class-validator';
import { EmailType } from '../../common/enums/email-type.enum';

export class CreateEmailDto {
  @IsOptional()
  status?: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  subject: string;

  @IsObject()
  context: Record<string, any>;

  @IsNotEmpty()
  @IsEnum(EmailType)
  type: EmailType;

  @IsOptional()
  sentAt?: number;

  @IsOptional()
  modelType?: string;

  @IsOptional()
  modelId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  leadId?: number;
}
