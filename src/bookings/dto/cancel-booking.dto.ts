import { ApiProperty } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiProperty({ required: false })
  reason?: string;
}