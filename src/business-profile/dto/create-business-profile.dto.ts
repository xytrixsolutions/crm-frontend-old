import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateBusinessProfileDto {
  @IsNotEmpty()
  businessName: string;

  @IsPhoneNumber()
  primaryPhone: string;

  @IsPhoneNumber()
  @IsOptional()
  alternatePhone?: string;

  @IsString()
  @IsOptional()
  defaultWarranty: string;

  @IsString()
  @IsOptional()
  businessType: string;

  @IsString()
  @IsOptional()
  vatNumber?: string;

  @IsNotEmpty()
  streetAddress: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  postCode: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  quotingPersonName: string;

  @IsOptional()
  completed: boolean;

  @IsOptional()
  vatEnabled: boolean;

  @IsOptional()
  logo: Express.Multer.File;
}
