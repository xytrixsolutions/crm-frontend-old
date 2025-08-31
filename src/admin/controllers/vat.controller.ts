import { Controller, Get, Post, Body, Patch, Req } from '@nestjs/common';
import { VatService } from '../services/vat.service';
import { UpdateVatDto } from '../dto/update-vat.dto';
import { CreateVatDto } from '../dto/create-vat.dto';
import { Request } from 'express';
import { SuccessMessage } from '../../common/annotations/success-message.decorator';
import { SuccessCode } from '../../common/annotations/success-code.decorator';
import { Roles } from '../../common/annotations/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('vat')
export class VatController {
  constructor(private readonly vatService: VatService) {}

  @SuccessMessage('VAT created successfully')
  @SuccessCode(201)
  @Roles(Role.ADMIN)
  @Post()
  create(@Req() req: Request, @Body() createVatDto: CreateVatDto) {
    const user = req.user as { sub: number; email: string };
    return this.vatService.create(createVatDto, user?.sub);
  }

  @SuccessMessage('VAT fetched successfully')
  @Get('')
  async findOne() {
    return await this.vatService.findOne();
  }

  @SuccessMessage('VAT updated successfully')
  @Roles(Role.ADMIN)
  @Patch('')
  update(@Body() updateVatDto: UpdateVatDto) {
    return this.vatService.update(updateVatDto);
  }
}
