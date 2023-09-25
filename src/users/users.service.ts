import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import bcrypt from 'bcrypt';
import { UserEntity } from './dto/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

    async getUsers(): Promise<UserEntity[]> {
        const users: UserEntity[] = await this.prisma.user.findMany();
        if (users.length === 0) {
            throw new NotFoundException('No users found');
        }

        return users;
    }

    async createUser(userDto: CreateUserDto): Promise<UserEntity> {
        const isUserExist: boolean = await this.isUserExist(userDto.login, userDto.email);
        if (isUserExist) {
            throw new BadRequestException('User already exist. Change your login or email');
        }

        const hash: string = await this.createHash(userDto.password);

        return this.prisma.user.create({
            data: {
                ...userDto,
                password: hash,
            },
        });
    }

    async createHash(password: string): Promise<string> {
        return bcrypt.hash(password, this.configService.get<number>('SALT_ROUND'));
    }

    private async isUserExist(login: string, email: string): Promise<boolean> {
        const user: UserEntity = await this.prisma.user.findFirst({
            where: {
                OR: [{ login }, { email }],
            },
        });

        return !!user;
    }

    async getUserById(id: number): Promise<UserEntity> {
        return this.prisma.user.findFirst({
            where: { id },
        });
    }

    async deleteUser(id: number): Promise<UserEntity> {
        return this.prisma.user.delete({
            where: { id },
        });
    }

    async updateUser(id: number, userDto: UpdateUserDto): Promise<UserEntity> {
        return this.prisma.user.update({
            where: { id },
            data: userDto,
        });
    }
}
