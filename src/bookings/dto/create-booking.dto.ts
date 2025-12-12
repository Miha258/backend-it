import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  masterId: string;

  @ApiProperty()
  serviceId: string;

  @ApiProperty({ description: 'Початок бронювання, ISO string' })
  date: string;

  @ApiProperty({ description: 'Початок бронювання, ISO string' })
  time: string;
}
