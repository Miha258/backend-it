import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Master } from '../masters/master.entity';
import { UserRole } from '../users/role.enum';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterMasterDto } from './dto/register-master.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Master) private readonly mastersRepo: Repository<Master>,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeUser(user: User) {
    const { ...rest } = user;
    return rest;
  }

  async registerClient(dto: RegisterClientDto) {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash,
      role: UserRole.CLIENT,
    });

    await this.usersRepo.save(user);
    return this.sanitizeUser(user);
  }

  async registerMaster(dto: RegisterMasterDto) {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash,
      role: UserRole.MASTER,
    });
    await this.usersRepo.save(user);

    const master = this.mastersRepo.create({
      fullName: dto.fullName,
      phone: dto.phone,
      description: dto.description,
      experienceYears: dto.experienceYears,
    });
    await this.mastersRepo.save(master);

    return { ...this.sanitizeUser(user), masterId: master.id };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.sanitizeUser(user),
    };
  }
}
