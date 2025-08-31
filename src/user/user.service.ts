import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CustomException } from '../common/exceptions/custom-exception';
import { Role } from '../common/enums/role.enum';
import { BusinessProfileService } from '../business-profile/business-profile.service';
import { CreateUserByAdminInterface } from './interfaces/create-user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { hashPassword } from '../common/helpers/hashPassword';
import { BusinessProfile } from '../business-profile/entities/business-profile.entity';
import { Status } from '../common/enums/status.enum';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => BusinessProfileService))
    private readonly businessService: BusinessProfileService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async createByAdmin(
    createUserDto: CreateUserByAdminInterface,
  ): Promise<User> {
    return await this.dataSource.transaction(async (manager) => {
      const { name, email, password, role, ...resdata } = createUserDto;
      const hashedPassword = await hashPassword(password);

      const createUserDtoObj = plainToInstance(CreateUserDto, {
        name,
        email,
        password: hashedPassword,
        role,
        status: Status.PENDING,
      });

      try {
        const user = manager.create(User, createUserDtoObj);
        const userRes = await manager.save(user);

        const profile = manager.create(BusinessProfile, {
          ...resdata,
          logo: undefined,
          user: user,
        });
        await manager.save(profile);

        return plainToInstance(User, userRes);
      } catch (error) {
        console.error('Error in createByAdmin:', error);
        throw error;
      }
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.usersRepository, {
      sortableColumns: ['id', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['updatedAt', 'DESC']],
      searchableColumns: ['name', 'email'],
      filterableColumns: {
        status: [FilterOperator.EQ, FilterSuffix.NOT],
        role: [FilterOperator.EQ, FilterSuffix.NOT],
      },
      relations: ['businessProfile'],
    });
  }

  async findOneById(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['businessProfile'],
    });
    if (!user) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(User, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<DeleteResult> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.usersRepository.delete(id);
  }

  async findByEmailAndRole(email: string, role: Role): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email, role },
      select: [
        'id',
        'email',
        'password',
        'role',
        'status',
        'name',
        'createdAt',
        'updatedAt',
      ],
      relations: ['businessProfile'],
    });
    if (!user) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
