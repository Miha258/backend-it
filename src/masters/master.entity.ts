import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from '../services/service.entity';
import { Booking } from '../bookings/booking.entity';
import { WorkSchedule } from '../schedule/work-schedule.entity';

@Entity('masters')
export class Master {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  fullName: string;

  @Column({ length: 255, nullable: true })
  role: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  experienceYears: number;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ type: 'float', default: 5.0 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  photoUrl: string;

  @ManyToMany(() => Service, (service) => service.masters, {
    eager: true,
  })
  @JoinTable({
    name: 'master_services',
    joinColumn: { name: 'master_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: Service[];

  @OneToMany(() => WorkSchedule, (schedule) => schedule.master, {
    cascade: true,
  })
  workSchedules: WorkSchedule[];

  @OneToMany(() => Booking, (booking) => booking.master)
  bookings: Booking[];
}
