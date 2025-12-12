import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkSchedule } from './work-schedule.entity';
import { MastersService } from '../masters/masters.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(WorkSchedule)
    private readonly scheduleRepo: Repository<WorkSchedule>,
    private readonly mastersService: MastersService,
  ) {}

  async setSchedule(masterId: string, data: { weekday: number; startTime: string; endTime: string }[]) {
    const master = await this.mastersService.findOne(masterId);

    await this.scheduleRepo.delete({ master });

    const records = data.map((d) =>
      this.scheduleRepo.create({
        master,
        weekday: d.weekday,
        startTime: d.startTime,
        endTime: d.endTime,
      }),
    );
    await this.scheduleRepo.save(records);
    return records;
  }

  getSchedule(masterId: string) {
    return this.scheduleRepo.find({
      where: { master: { id: masterId } },
      order: { weekday: 'ASC' },
    });
  }
}
