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
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { CreateTermsAndConditionDto } from './dto/create-terms-and-condition.dto';
import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
import { SuccessMessage } from '../common/annotations/success-message.decorator';
import { SuccessCode } from '../common/annotations/success-code.decorator';
import { Request } from 'express';

@Controller('terms-and-conditions')
export class TermsAndConditionsController {
  constructor(
    private readonly termsAndConditionsService: TermsAndConditionsService,
  ) {}

  @SuccessMessage('Terms and conditions created successfully')
  @SuccessCode(201)
  @Post()
  async create(
    @Req() req: Request,
    @Body() createTermsAndConditionDto: CreateTermsAndConditionDto,
  ) {
    const user = req.user as { sub: number; email: string };
    return await this.termsAndConditionsService.create(
      createTermsAndConditionDto,
      user.sub,
    );
  }

  @Get()
  findAll() {
    return this.termsAndConditionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.termsAndConditionsService.findOneByBusinessId(+id);
  }

  @SuccessMessage('Terms and conditions updated successfully')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTermsAndConditionDto: UpdateTermsAndConditionDto,
  ) {
    return this.termsAndConditionsService.update(
      +id,
      updateTermsAndConditionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.termsAndConditionsService.remove(+id);
  }
}
