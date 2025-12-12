import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MastersModule } from './masters/masters.module';
import { ScheduleModule } from './schedule/schedule.module';
import { BookingModule } from './bookings/booking.module';
import { User } from './users/user.entity';
import { Master } from './masters/master.entity';
import { ServiceCategory } from './services/service-category.entity';
import { Service } from './services/service.entity';
import { WorkSchedule } from './schedule/work-schedule.entity';
import { Booking } from './bookings/booking.entity';
import { ServicesModule } from './services/services.module';
import { DatabaseModule } from './database/database.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
console.log(join(__dirname, '..', 'src', 'avatars'))
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src', 'avatars'),
      serveRoot: '/avatars',
      serveStaticOptions: {
        index: false,
        setHeaders: (res, path, stat) => {
          res.set('Content-Disposition', 'inline');
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'beauty_user',
        password: process.env.DB_PASSWORD || 'beauty_password',
        database: process.env.DB_NAME || 'beauty_salon',
        entities: [
          User,
          Master,
          ServiceCategory,
          Service,
          WorkSchedule,
          Booking,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    MastersModule,
    ServicesModule,
    ScheduleModule,
    BookingModule,
    DatabaseModule,
  ],
})
export class AppModule {}
