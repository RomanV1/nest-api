import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/users.dto'
import * as bcrypt from 'bcrypt'
import { config } from 'dotenv'
config()

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(): Promise<User[]> {
        return this.prisma.user.findMany()
    }

    async createUser(userDto: CreateUserDto): Promise<User> {
        const hash: string = await bcrypt.hash(userDto.password, Number(process.env.SALT_ROUND))
        return this.prisma.user.create({
            data: {
                ...userDto,
                password: hash,
            },
        })
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
            where: {
                id: id,
            },
        })
    }

    async deleteUser(id: number): Promise<User> {
        return this.prisma.user.delete({
            where: {
                id: id,
            },
        })
    }
}
