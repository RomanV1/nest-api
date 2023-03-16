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

    async getUsers() {
        return this.prisma.user.findMany()
    }

    async createUser(userDto: CreateUserDto): Promise<User> {
        const hash = await this.createHash(userDto.password)
        return this.prisma.user.create({
            data: {
                ...userDto,
                password: hash,
            },
        })
    }

    async createHash(password: string): Promise<string> {
        return bcrypt.hash(password, Number(process.env.SALT_ROUND))
    }

    async isUserExist(userDto: CreateUserDto): Promise<boolean> {
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
    }

    async getUserById(id: number): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: { id },
        })
    }

    async deleteUser(id: number): Promise<User> {
        return this.prisma.user.delete({
            where: { id },
        })
    }

    async updateUser(id: number, userDto: UpdateUserDto): Promise<UpdateUserDto> {
        return this.prisma.user.update({
            where: { id },
            data: userDto,
        })
    }
}
