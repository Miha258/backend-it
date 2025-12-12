import { ApiProperty } from '@nestjs/swagger';

export class RegisterClientDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}