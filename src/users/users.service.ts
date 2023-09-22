import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
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

    async createUser(userDto: CreateUserDto): Promise<User> {
        const hash = await this.createHash(userDto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    ...userDto,
                    password: hash,
                },
            });

            return user;
        } catch (err) {
            throw new Error(`class UsersService method createUser \n${err.message}`);
        }
    }

    async createHash(password: string): Promise<string> {
        try {
            const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
            return hash;
        } catch (err) {
            throw new Error(err);
        }
    }

    async isUserExist(userDto: CreateUserDto): Promise<boolean> {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        {
                            login: userDto.login,
                        },
                        {
                            email: userDto.email,
                        },
                    ],
                },
            });

            return user !== null;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getUserById(id: number): Promise<User> {
        try {
            const user = await this.prisma.user.findFirst({
                where: { id },
            });

            return user;
        } catch (err) {
            throw new Error(err);
        }
    }

    async deleteUser(id: number): Promise<User> {
        try {
            const user = await this.prisma.user.delete({
                where: { id },
            });

            return user;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateUser(id: number, userDto: UpdateUserDto): Promise<User> {
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
