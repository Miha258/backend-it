import { ApiProperty } from '@nestjs/swagger';

export class RegisterMasterDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  experienceYears?: number;
}
