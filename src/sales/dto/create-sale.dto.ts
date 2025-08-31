import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { CreateSaleItemDto } from './create-sale-item.dto';
import { SaleType } from '../../common/enums/sale-type.enum';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsEnum(SaleType)
  type: SaleType;

  @IsOptional()
  @IsNumber()
  invoiceNumber?: number;

  @IsNotEmpty()
  warranty: string;

  @IsNotEmpty()
  engineType: string;

  @IsOptional()
  @IsString()
  milage?: string;

  @IsNotEmpty()
  @IsNumber()
  subTotal: number;

  @IsOptional()
  @IsNumber()
  vatPercent?: number;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  leadId: number;

  @IsOptional()
  userId?: number;

  @IsOptional()
  preview?: boolean;

  @IsOptional()
  lineItems: CreateSaleItemDto[];
}
