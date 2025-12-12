import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Miha' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Riznyk' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  lastName?: string;

  @ApiPropertyOptional({ example: '+380935358497' })
  @IsOptional()
  @IsString()
  @Length(3, 30)
  phone?: string;

  @ApiPropertyOptional({
    example: 'https://i.ibb.co/L5r0sLw/default-avatar.png',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
