import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInerceptor } from './interceptors/current-user.interceptor';

import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    AuthService,
    { useClass: CurrentUserInerceptor, provide: APP_INTERCEPTOR },
  ],
})
export class UsersModule {}
