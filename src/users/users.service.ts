import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto, UpdateUserDto } from './dto/users.dto'
import * as bcrypt from 'bcrypt'
import { config } from 'dotenv'
config()

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(): Promise<User[]> {
        try {
            return this.prisma.user.findMany()
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }

    async createUser(userDto: CreateUserDto): Promise<User> {
        const hash = await this.createHash(userDto.password)
        try {
            return this.prisma.user.create({
                data: {
                    ...userDto,
                    password: hash,
                },
            })
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }

    async createHash(password: string): Promise<string> {
        try {
            return bcrypt.hash(password, Number(process.env.SALT_ROUND))
        } catch (e) {
            console.log(e)
            throw new Error()
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
            })

            return user !== null
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }

    async getUserById(id: number): Promise<User | null> {
        try {
            return this.prisma.user.findFirst({
                where: { id },
            })
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }

    async deleteUser(id: number): Promise<User> {
        try {
            return this.prisma.user.delete({
                where: { id },
            })
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }

    async updateUser(id: number, userDto: UpdateUserDto): Promise<UpdateUserDto> {
        try {
            return this.prisma.user.update({
                where: { id },
                data: userDto,
            })
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
}
