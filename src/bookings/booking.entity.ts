import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Master } from '../masters/master.entity';
import { Service } from '../services/service.entity';
import { BookingStatus } from './booking-status.enum';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  client: User;

  @ManyToOne(() => Master, { eager: true })
  master: Master;

  @ManyToOne(() => Service, { eager: true })
  service: Service;

  @Column({ type: 'uuid' })
  clientId: string;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;
}
