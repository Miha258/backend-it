import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Master } from './master.entity';
import { MastersService } from './masters.service';
import { MastersController } from './masters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Master])],
  providers: [MastersService],
  controllers: [MastersController],
  exports: [MastersService],
})
export class MastersModule {}
