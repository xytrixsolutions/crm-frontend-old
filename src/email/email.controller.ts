import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { Request } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { SuccessMessage } from '../common/annotations/success-message.decorator';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @SuccessMessage('Email sent successfully')
  @Post()
  async send(@Req() req: Request, @Body() createEmailDto: CreateEmailDto) {
    const user = req.user as { sub: number; email: string };
    return await this.emailService.sendMail(createEmailDto, user?.sub);
  }

  @SuccessMessage('Emails fetched successfully')
  @Get()
  async findAll(@Paginate() query: PaginateQuery, @Req() req: Request) {
    const user = req.user as { sub: number; email: string };
    return await this.emailService.findAll(query, user?.sub);
  }

  @SuccessMessage('Email fetched successfully')
  @Get('/by-model')
  async findOne(
    @Query('modelId', ParseIntPipe) modelId: number,
    @Query('modelType') modelType: string,
  ) {
    return await this.emailService.findByModelTypeAndId(modelType, modelId);
  }
}
