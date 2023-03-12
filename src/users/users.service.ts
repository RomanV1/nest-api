import { Get, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/users.dto'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getUsers(): Promise<User[]> {
        return this.prisma.user.findMany()
    }

    async createUser(userDto: CreateUserDto): Promise<void> {
        await this.prisma.user.create({
            data: {
                ...userDto,
            },
        })
    }

    async getUserById(id: number): Promise<User> {
        return this.prisma.user.findFirst({
            where: {
                id: id,
            },
        })
    }
}
