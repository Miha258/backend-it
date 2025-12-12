import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { ServiceCategory } from './service-category.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(ServiceCategory)
    private readonly categoriesRepo: Repository<ServiceCategory>,
  ) {}

  findAll() {
    return this.serviceRepo.find();
  }

  async findByCategory(categoryId?: number) {
    if (!categoryId) {
      return this.serviceRepo.find();
    }

    return this.serviceRepo.find({
      where: { categoryId },
    });
  }

  search(query: string) {
    return this.serviceRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.masters', 'm')
      .where('LOWER(s.name) LIKE LOWER(:q)', { q: `%${query}%` })
      .orWhere('LOWER(m.fullName) LIKE LOWER(:q)', { q: `%${query}%` })
      .getMany();
  }

  async findAllCategories() {
    return this.categoriesRepo.find({
      order: { name: 'ASC' },
    });
  }
}
