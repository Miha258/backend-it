import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './booking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/role.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Створити запис (клієнт)' })
  create(@Body() dto: CreateBookingDto, @CurrentUser() user: any) {
    return this.bookingsService.create(dto, user.id);
  }

  @Get('my')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Мої записи (кабінет клієнта)' })
  getMy(@CurrentUser() user: any) {
    return this.bookingsService.getClientBookings(user.id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.CLIENT, UserRole.MASTER)
  @ApiOperation({ summary: 'Скасувати запис' })
  cancel(@Param('id') id: string, @Body() _dto: CancelBookingDto, @CurrentUser() user: any) {
    return this.bookingsService.cancel(id, user);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MASTER)
  @ApiOperation({ summary: 'Підтвердити запис (майстером)' })
  confirm(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.confirm(id, user);
  }
}
