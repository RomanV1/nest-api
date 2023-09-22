import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { UserEntity } from './dto/user.entity';
config();

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(): Promise<UserEntity[]> {
        try {
            const users: UserEntity[] = await this.prisma.user.findMany();
            if (users.length === 0) {
                throw new NotFoundException('No users found');
            }

            return users;
        } catch (err) {
            throw new Error(err);
        }
    }

    async createUser(userDto: CreateUserDto): Promise<UserEntity> {
        const isUserExist: boolean = await this.isUserExist(userDto.login, userDto.email);
        if (isUserExist) {
            throw new BadRequestException('User already exist. Change your login or email');
        }

        const hash: string = await this.createHash(userDto.password);
        try {
            const user: UserEntity = await this.prisma.user.create({
                data: {
                    ...userDto,
                    password: hash,
                },
            });

            return user;
        } catch (err) {
            throw new Error(err);
        }
    }

    async createHash(password: string): Promise<string> {
        try {
            const hash: string = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
            return hash;
        } catch (err) {
            throw new Error(err);
        }
    }

    private async isUserExist(login: string, email: string): Promise<boolean> {
        try {
            const user: UserEntity = await this.prisma.user.findFirst({
                where: {
                    OR: [{ login }, { email }],
                },
            });

            return !!user;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getUserById(id: number): Promise<UserEntity> {
        try {
            const user = await this.prisma.user.findFirst({
                where: { id },
            });

            return user;
        } catch (err) {
            throw new Error(err);
        }
    }

    async deleteUser(id: number): Promise<UserEntity> {
        try {
            const user = await this.prisma.user.delete({
                where: { id },
            });

            return user;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateUser(id: number, userDto: UpdateUserDto): Promise<UserEntity> {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: userDto,
            });

            return user;
        } catch (err) {
            throw new Error(err);
        }
    }
}
