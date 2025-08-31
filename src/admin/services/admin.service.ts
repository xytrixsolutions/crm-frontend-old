import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';

@Injectable()
export class AdminService {
  create(createAdminDto: CreateAdminDto) {
    return `This action adds a new admin with data: ${JSON.stringify(createAdminDto)}`;
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin with data: ${JSON.stringify(updateAdminDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
