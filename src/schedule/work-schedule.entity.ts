import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Master } from '../masters/master.entity';

@Entity()
export class WorkSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Master, (master) => master.workSchedules, {
    onDelete: 'CASCADE',
  })
  master: Master;

  @Column({ type: 'int' })
  weekday: number; // 0-6

  @Column()
  startTime: string; // "09:00"

  @Column()
  endTime: string; // "18:00"
}