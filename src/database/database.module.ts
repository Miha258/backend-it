import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Master } from '../masters/master.entity';
import { User } from '../users/user.entity';
import { ServiceCategory } from '../services/service-category.entity';
import { Service } from '../services/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Master, User, Service, ServiceCategory])],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
