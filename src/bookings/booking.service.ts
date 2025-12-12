import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Master } from '../masters/master.entity';
import { Service } from '../services/service.entity';
import { User } from '../users/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from './booking-status.enum';
import { UserRole } from '../users/role.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepo: Repository<Booking>,
    @InjectRepository(Master) private readonly mastersRepo: Repository<Master>,
    @InjectRepository(Service)
    private readonly servicesRepo: Repository<Service>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateBookingDto, clientId: string) {
    const client = await this.usersRepo.findOne({ where: { id: clientId } });
    const master = await this.mastersRepo.findOne({
      where: { id: dto.masterId },
    });
    const service = await this.servicesRepo.findOne({
      where: { id: dto.serviceId },
    });

    if (!client || !master || !service) {
      throw new BadRequestException('Invalid ids');
    }

    const startTime = new Date(`${dto.date}T${dto.time}:00`);
    const endTime = new Date(
      startTime.getTime() + service.durationMinutes * 60 * 1000,
    );

    const booking = this.bookingsRepo.create({
      client,
      master,
      service,
      startTime,
      endTime,
      status: BookingStatus.PENDING,
    });

    return this.bookingsRepo.save(booking);
  }

  getClientBookings(clientId: string) {
    return this.bookingsRepo.find({
      where: { clientId },
      order: { startTime: 'DESC' },
    });
  }

  async cancel(id: string, user: any) {
    const booking = await this.bookingsRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    if (user.role === UserRole.CLIENT && booking.client.id !== user.id) {
      throw new ForbiddenException();
    }

    if (user.role === UserRole.MASTER && booking.master.id !== user.masterId) {
      throw new ForbiddenException();
    }

    booking.status =
      user.role === UserRole.MASTER
        ? BookingStatus.CANCELLED_BY_MASTER
        : BookingStatus.CANCELLED_BY_CLIENT;

    return this.bookingsRepo.save(booking);
  }

  async confirm(id: string, user: any): Promise<Booking> {
    const booking = await this.bookingsRepo.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Запис не знайдено');
    }

    if (user.role === UserRole.MASTER) {
      if (
        !user.masterId ||
        String(booking.master.id) !== String(user.masterId)
      ) {
        throw new ForbiddenException('Ви не можете підтвердити цей запис');
      }
    } else if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Доступ заборонено');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        'Підтвердити можна лише записи у статусі PENDING',
      );
    }

    booking.status = BookingStatus.CONFIRMED;
    return this.bookingsRepo.save(booking);
  }
}
