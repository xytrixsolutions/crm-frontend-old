/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SuccessCode } from '../common/annotations/success-code.decorator';
import { SuccessMessage } from '../common/annotations/success-message.decorator';
import { Request } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { SaleType } from 'src/common/enums/sale-type.enum';
import { CustomException } from 'src/common/exceptions/custom-exception';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @SuccessMessage('Invoice number generated successfully')
  @Get('invoice-number')
  async getInvoiceNumber(@Query('type') type: string) {
    if (!type || !Object.values(SaleType).includes(type as SaleType)) {
      throw new CustomException(
        'Invalid sale type provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.salesService.generateNextInvoiceNumber(type as SaleType);
  }

  @SuccessMessage('Sale created successfully')
  @SuccessCode(201)
  @Post()
  async create(@Req() req: Request, @Body() createSaleDto: CreateSaleDto) {
    const user = req.user as { sub: number; email: string };
    const data = {
      ...createSaleDto,
      userId: user?.sub,
    };
    return await this.salesService.create(data);
  }

  @SuccessMessage('Sales fetched successfully')
  @Get()
  async findAll(@Paginate() query: PaginateQuery, @Req() req: Request) {
    const user = req.user as { sub: number; email: string };
    return await this.salesService.findAll(query, user?.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
