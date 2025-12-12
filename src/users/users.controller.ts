import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Повертає поточного юзера' })
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Оновити профіль (Multipart/form-data)' })
  @ApiConsumes('multipart/form-data') // Для Swagger
  @ApiBody({
    description: 'Дані профілю та аватар',
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phone: { type: 'string' },
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: join(process.cwd(), 'src', 'avatars'),
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const fileExt = extname(file.originalname);
          callback(null, `avatar${randomName}${fileExt}`);
        },
      }),
    }),
  )
  updateMe(
    @Body() dto: UpdateProfileDto,
    @CurrentUser() user: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const avatarUrl = file
      ? `http://localhost:3000/avatars/${file.filename}`
      : undefined;

    return this.usersService.updateProfile(user.id, {
      ...dto,
      avatarUrl,
    });
  }
}