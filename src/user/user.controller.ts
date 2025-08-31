import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/annotations/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Request } from 'express';
import { CreateUserByAdminInterface } from './interfaces/create-user.interface';
import { SuccessMessage } from '../common/annotations/success-message.decorator';
import { SuccessCode } from '../common/annotations/success-code.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @SuccessMessage('User registerd successfully')
  @SuccessCode(201)
  @Post()
  async create(@Body() createUserDto: CreateUserByAdminInterface) {
    const user = await this.userService.createByAdmin(createUserDto);
    return user;
  }

  @SuccessMessage('Users fetched successfully')
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.userService.findAll(query);
  }

  @SuccessMessage('User fetched successfully')
  @Get('me')
  async profile(@Req() req: Request) {
    const user = req.user as { sub: number; email: string };
    const response = await this.userService.findOneById(user.sub);
    return response;
  }

  @SuccessMessage('User fetched successfully')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOneById(+id);
    return user;
  }

  @SuccessMessage('User updated successfully')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(+id, updateUserDto);
    return updatedUser;
  }

  @SuccessMessage('User deleted successfully')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return null;
  }
}
