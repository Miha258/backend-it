import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Master } from '../masters/master.entity';
import { Booking } from '../bookings/booking.entity';
import { ServiceCategory } from './service-category.entity';

export interface ServicePriceItem {
  name: string;
  time: string;
  price: number | string;
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'integer' })
  categoryId: number;

  @Column({ length: 150, unique: true })
  slug: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'int', default: 60 })
  durationMinutes: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'jsonb', nullable: true })
  priceList?: ServicePriceItem[];

  @ManyToOne(() => ServiceCategory, (category) => category.services, {
    eager: true,
    nullable: false,
  })
  category: ServiceCategory;

  @ManyToMany(() => Master, (master) => master.services)
  masters: Master[];

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];
}
