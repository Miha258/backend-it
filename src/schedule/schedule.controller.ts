import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('schedule')
@Controller('masters/:masterId/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати графік роботи майстра' })
  getSchedule(@Param('masterId') masterId: string) {
    return this.scheduleService.getSchedule(masterId);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.MASTER)
  @ApiOperation({ summary: 'Оновити графік роботи (для майстра)' })
  setSchedule(
    @Param('masterId') masterId: string,
    @Body() body: { weekday: number; startTime: string; endTime: string }[],
    @CurrentUser() user: any,
  ) {
    // тут можна додати перевірку, що masterId == user.masterId (через зв'язку)
    return this.scheduleService.setSchedule(masterId, body);
  }
}
