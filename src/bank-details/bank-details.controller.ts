import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { BankDetailsService } from './bank-details.service';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { SuccessMessage } from '../common/annotations/success-message.decorator';
import { SuccessCode } from '../common/annotations/success-code.decorator';
import { Request } from 'express';

@Controller('bank-details')
export class BankDetailsController {
  constructor(private readonly bankDetailsService: BankDetailsService) {}

  @SuccessMessage('Bank details created successfully')
  @SuccessCode(201)
  @Post()
  async create(
    @Req() req: Request,
    @Body() createBankDetailDto: CreateBankDetailDto,
  ) {
    const user = req.user as { sub: number; email: string };
    return this.bankDetailsService.create(createBankDetailDto, user.sub);
  }

  @Get()
  findAll() {
    return this.bankDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankDetailsService.findOne(+id);
  }

  @SuccessMessage('Bank details updated successfully')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBankDetailDto: UpdateBankDetailDto,
  ) {
    return await this.bankDetailsService.update(+id, updateBankDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankDetailsService.remove(+id);
  }
}
