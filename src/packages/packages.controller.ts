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
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { SuccessCode } from '../common/annotations/success-code.decorator';
import { SuccessMessage } from '../common/annotations/success-message.decorator';
import { Roles } from '../common/annotations/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateBusinessPackageDto } from './dto/create-business-package.dto';
import { Request } from 'express';
import { UpdateBusinessPackageDto } from './dto/update-business-package.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @SuccessMessage('Business package created successfully')
  @SuccessCode(201)
  @Roles(Role.ADMIN)
  @Post('/business')
  async createBusinessPackage(
    @Body() createBusinessPackageDto: CreateBusinessPackageDto,
  ) {
    return await this.packagesService.createBusinessPackage(
      createBusinessPackageDto,
    );
  }

  @SuccessMessage('Business package fetched successfully')
  @Get('/business/current')
  async findOneBusinessPackage(@Req() req: Request) {
    const user = req.user as { sub: number; email: string };
    return await this.packagesService.getCurrentBusinessPackage(user.sub);
  }

  @SuccessMessage('Business package updated successfully')
  @Roles(Role.ADMIN)
  @Patch('/business/:id')
  async updateBusinessPackage(
    @Param('id') id: string,
    @Body() updateBusinessPackageDto: UpdateBusinessPackageDto,
  ) {
    return await this.packagesService.updateBusinessPackage(
      +id,
      updateBusinessPackageDto,
    );
  }

  @SuccessMessage('Business packages fetched successfully')
  @Get('/business')
  async findAllBusinessPackages(@Paginate() query: PaginateQuery) {
    return await this.packagesService.findAllBusinessPackages(query);
  }

  @SuccessMessage('Package created successfully')
  @SuccessCode(201)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createPackageDto: CreatePackageDto) {
    return await this.packagesService.create(createPackageDto);
  }

  @SuccessMessage('Packages fetched successfully')
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.packagesService.findAll(query);
  }

  @SuccessMessage('Package fetched successfully')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.packagesService.findOneById(+id);
  }

  @SuccessMessage('Package updated successfully')
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return await this.packagesService.update(+id, updatePackageDto);
  }

  @SuccessMessage('Package deleted successfully')
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.packagesService.remove(+id);
  }
}
