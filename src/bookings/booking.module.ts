import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsService } from './booking.service';
import { BookingController } from './booking.controller';
import { Master } from '../masters/master.entity';
import { Service } from '../services/service.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Master, Service, User])],
  providers: [BookingsService],
  controllers: [BookingController],
})
export class BookingModule {}
