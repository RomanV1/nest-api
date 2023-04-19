import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
config();

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(): Promise<User[] | null> {
        try {
            const users = await this.prisma.user.findMany();
            return users;
        } catch (e) {
            throw new Error(`class UsersService method getUsers \n${e.message}`);
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
        } catch (e) {
            throw new Error(`class UsersService method createUser \n${e.message}`);
        }
    }

    async createHash(password: string): Promise<string> {
        try {
            const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
            return hash;
        } catch (e) {
            throw new Error(`class UsersService method createHash \n${e.message}`);
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
        } catch (e) {
            throw new Error(`class UsersService method isUserExist \n${e.message}`);
        }
    }

    async getUserById(id: number): Promise<User | null> {
        try {
            const user = await this.prisma.user.findFirst({
                where: { id },
            });

            return user;
        } catch (e) {
            throw new Error(`class UsersService method getUserById \n${e.message}`);
        }
    }

    async deleteUser(id: number): Promise<User | null> {
        try {
            const user = await this.prisma.user.delete({
                where: { id },
            });

            return user;
        } catch (e) {
            throw new Error(`class UsersService method deleteUser \n${e.message}`);
        }
    }

    async updateUser(id: number, userDto: UpdateUserDto): Promise<User | null> {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: userDto,
            });

            return user;
        } catch (e) {
            throw new Error(`class UsersService method updateUser \n${e.message}`);
        }
    }
}
