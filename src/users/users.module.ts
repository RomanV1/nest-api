import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [ConfigService],
    controllers: [UsersController],
    providers: [UsersService, PrismaService],
})
export class UsersModule {}
