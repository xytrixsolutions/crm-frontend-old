import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BusinessProfileService } from './business-profile.service';
import { CreateBusinessProfileDto } from './dto/create-business-profile.dto';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';
import { Request } from 'express';
import { SuccessMessage } from '../common/annotations/success-message.decorator';
import { SuccessCode } from '../common/annotations/success-code.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('business-profile')
export class BusinessProfileController {
  constructor(
    private readonly businessProfileService: BusinessProfileService,
  ) {}

  @SuccessMessage('Business profile fetched successfully')
  @Get('/user')
  async findUserBusiness(@Req() req: Request) {
    const user = req.user as { sub: number; email: string };
    const businessProfile = await this.businessProfileService.findOneByUserId(
      user.sub,
    );
    return businessProfile;
  }

  @UseInterceptors(
    FileInterceptor('logo', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  @SuccessMessage('Business profile created successfully')
  @SuccessCode(201)
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() createBusinessProfileDto: CreateBusinessProfileDto,
  ) {
    const user = req.user as { sub: number; email: string };
    const userId = user.sub;
    const response = await this.businessProfileService.create({
      ...createBusinessProfileDto,
      logo: file,
      userId: userId,
    });
    return response;
  }

  @SuccessMessage('Business profiles fetched successfully')
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.businessProfileService.findAll(query);
  }

  @SuccessMessage('Business profile fetched successfully')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const businessProfile = await this.businessProfileService.findOneById(+id);
    return businessProfile;
  }

  @UseInterceptors(
    FileInterceptor('logo', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  @SuccessMessage('Business profile updated successfully')
  @Patch(':id')
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateBusinessProfileDto: UpdateBusinessProfileDto,
  ) {
    const updateData = {
      ...updateBusinessProfileDto,
      logo: file,
    };
    const businessProfile = await this.businessProfileService.update(
      +id,
      updateData,
    );
    return businessProfile;
  }

  @SuccessMessage('Business Profile deleted successfully')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.businessProfileService.remove(+id);
    return null;
  }
}
