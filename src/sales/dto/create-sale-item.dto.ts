import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateSaleItemDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsOptional()
  salesId: number;
}
