import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Req,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateLeadSourceDto } from './dto/create-lead-source.dto';
import { SuccessMessage } from '../common/annotations/success-message.decorator';
import { SuccessCode } from '../common/annotations/success-code.decorator';
import { CreateLeadActionDto } from './dto/create-lead-action.dto';
import { Request } from 'express';
import { Public } from 'src/common/annotations/public.decorator';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @SuccessMessage('Lead action created successfully')
  @SuccessCode(201)
  @Post('/action')
  async createLeadActon(
    @Req() req: Request,
    @Body() createLeadActionDto: CreateLeadActionDto,
  ) {
    const user = req.user as { sub: number; email: string };
    return this.leadsService.createLeadAction({
      ...createLeadActionDto,
      userId: user.sub,
    });
  }

  @SuccessMessage('Lead source created successfully')
  @SuccessCode(201)
  @Post('/source')
  async createLeadSource(@Body() createLeadSourceDto: CreateLeadSourceDto) {
    return this.leadsService.createLeadSource(createLeadSourceDto);
  }

  @SuccessMessage('Lead sources successfully')
  @Get('/source')
  async findAllSources(@Paginate() query: PaginateQuery) {
    return await this.leadsService.findAllSources(query);
  }

  @SuccessMessage('Vehicle created successfully')
  @Get('/vehicle-details/:vrm')
  async fetchVehicleDetails(@Param('vrm') vrm: string) {
    return await this.leadsService.vehicleDetails(vrm);
  }

  @Public()
  @SuccessMessage('Lead created successfully')
  @SuccessCode(201)
  @Post()
  async create(
    @Body() createLeadDto: CreateLeadDto,
    @Headers('x-frontend-url') frontendUrl: string,
  ) {
    return await this.leadsService.create(createLeadDto, frontendUrl ?? '');
  }

  @SuccessMessage('Leads fetched successfully')
  @Get()
  async findAll(@Paginate() query: PaginateQuery, @Req() req: Request) {
    const user = req.user as { sub: number; email: string };
    return this.leadsService.findAll(query, user.sub);
  }

  @SuccessMessage('Lead fetched successfully')
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { sub: number; email: string };
    return await this.leadsService.findOne(+id, user.sub);
  }

  @SuccessMessage('Leads updated successfully')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(+id, updateLeadDto);
  }

  @SuccessMessage('Leads deleted successfully')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(+id);
  }
}
