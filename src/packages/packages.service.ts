import { BusinessPackage } from 'src/packages/entities/business-package.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { Repository } from 'typeorm';
import { Status } from '../common/enums/status.enum';
import { CustomException } from '../common/exceptions/custom-exception';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { CreateBusinessPackageDto } from './dto/create-business-package.dto';
import { UpdateBusinessPackageDto } from './dto/update-business-package.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    @InjectRepository(BusinessPackage)
    private businessPackageRepository: Repository<BusinessPackage>,
  ) {}

  async create(createPackageDto: CreatePackageDto) {
    const packageEntity = this.packageRepository.create({
      ...createPackageDto,
      status: Status.ACTIVE,
    });
    return await this.packageRepository.save(packageEntity);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Package>> {
    return paginate(query, this.packageRepository, {
      sortableColumns: ['id', 'leadLimit', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['updatedAt', 'DESC']],
      searchableColumns: ['name'],
      filterableColumns: {
        status: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async findOneById(id: number) {
    const packageEntity = await this.packageRepository.findOneBy({
      id,
    });

    if (!packageEntity) {
      throw new CustomException('Package not found', HttpStatus.NOT_FOUND);
    }

    return packageEntity;
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const packageEntity = await this.packageRepository.preload({
      id,
      ...updatePackageDto,
    });

    if (!packageEntity) {
      throw new CustomException('Package not found', HttpStatus.NOT_FOUND);
    }

    return await this.packageRepository.save(packageEntity);
  }

  async remove(id: number) {
    const packageEntity = await this.packageRepository.findOneBy({
      id,
    });

    if (!packageEntity) {
      throw new CustomException('Package not found', HttpStatus.NOT_FOUND);
    }

    return await this.packageRepository.remove(packageEntity);
  }

  async createBusinessPackage(
    createPackageDto: CreateBusinessPackageDto,
  ): Promise<BusinessPackage> {
    const businessPackage = this.businessPackageRepository.create({
      status: Status.ACTIVE,
      business: { id: createPackageDto.businessId },
      package: { id: createPackageDto.packageId },
      leadUsed: 0,
      expiresAt: createPackageDto.expiresAt,
    });
    return await this.businessPackageRepository.save(businessPackage);
  }

  async getCurrentBusinessPackage(
    userId: number,
  ): Promise<BusinessPackage | null> {
    const businessPackage = await this.businessPackageRepository.findOne({
      where: { business: { user: { id: userId } }, status: Status.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    if (!businessPackage) {
      return null;
    }

    return businessPackage;
  }

  async updateBusinessPackage(
    id: number,
    updatePackageDto: UpdateBusinessPackageDto,
  ): Promise<BusinessPackage> {
    const businessPackage = await this.businessPackageRepository.preload({
      id,
      ...updatePackageDto,
    });

    if (!businessPackage) {
      throw new CustomException(
        'Business package not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.businessPackageRepository.save(businessPackage);
  }

  async findAllBusinessPackages(
    query: PaginateQuery,
    isJob?: boolean,
  ): Promise<Paginated<BusinessPackage>> {
    return paginate(query, this.businessPackageRepository, {
      sortableColumns: ['id', 'leadUsed', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['updatedAt', 'DESC']],
      searchableColumns: ['package.name'],
      relations: isJob ? ['business.user'] : ['package'],
      filterableColumns: {
        status: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }
}
