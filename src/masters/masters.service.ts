import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Master } from './master.entity';

@Injectable()
export class MastersService {
  constructor(
    @InjectRepository(Master) private readonly mastersRepo: Repository<Master>,
  ) {}

  findAll() {
    return this.mastersRepo.find();
  }

  findOne(id: string) {
    return this.mastersRepo.findOne({ where: { id } });
  }
}
