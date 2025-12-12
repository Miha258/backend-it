import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { LoginDto, RegisterClientDto, RegisterMasterDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/client')
  @ApiOperation({ summary: 'Реєстрація клієнта' })
  registerClient(@Body() dto: RegisterClientDto) {
    return this.authService.registerClient(dto);
  }

  @Post('register/master')
  @ApiOperation({ summary: 'Реєстрація майстра' })
  registerMaster(@Body() dto: RegisterMasterDto) {
    return this.authService.registerMaster(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Логін' })
  @ApiOkResponse({ description: 'JWT токен' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
