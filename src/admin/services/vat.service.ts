import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateVatDto } from '../dto/create-vat.dto';
import { UpdateVatDto } from '../dto/update-vat.dto';
import { Vat } from '../entities/vat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../common/enums/status.enum';
import { CustomException } from '../../common/exceptions/custom-exception';

@Injectable()
export class VatService {
  constructor(
    @InjectRepository(Vat)
    private readonly vatRepository: Repository<Vat>,
  ) {}

  async create(createVatDto: CreateVatDto, userId: number): Promise<Vat> {
    const data = {
      ...createVatDto,
      userId,
      status: Status.ACTIVE,
    };
    const newVat = this.vatRepository.create(data);
    return await this.vatRepository.save(newVat);
  }

  async findOne() {
    const vat = await this.vatRepository.findOne({
      where: { status: Status.ACTIVE },
    });

    if (!vat) {
      throw new CustomException('Vat not found', HttpStatus.NOT_FOUND);
    }

    return vat;
  }

  async update(updateVatDto: UpdateVatDto) {
    const vat = await this.vatRepository.findOne({
      where: { status: Status.ACTIVE },
    });

    if (!vat) {
      throw new CustomException('Vat not found', HttpStatus.NOT_FOUND);
    }

    vat.vatPercent = updateVatDto.vatPercent!;
    return await this.vatRepository.save(vat);
  }
}
