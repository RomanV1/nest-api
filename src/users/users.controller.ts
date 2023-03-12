import { Body, Controller, Get, InternalServerErrorException, Param, Post, Req, Res } from '@nestjs/common'
import { User } from '@prisma/client'
import { Request, Response } from 'express'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/users.dto'

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get()
    async getUsers(@Req() req: Request, @Res() res: Response): Promise<User[] | string> {
        try {
            const users = await this.userService.getUsers()
            if (!users.length) {
                res.status(404).json({ statusCode: 404, message: 'Users not found' })
                return
            }

            res.status(200).json(users)
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    @Post()
    async createUser(@Res() res: Response, @Body() user: CreateUserDto): Promise<string> {
        try {
            if (!user.login || !user.email || !user.hash) {
                res.status(400).json({ statusCode: 400, error: 'Bad Request' })
                return
            }

            await this.userService.createUser(user)
            res.status(201).json({ statusCode: 201, message: 'User has been created' })
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    @Get('/:id')
    async getUserById(@Res() res: Response, @Param('id') id: string) {
        try {
            if (!Number(id)) {
                res.status(400).json({ statusCode: 400, error: 'Bad Request' })
                return
            }

            const user = await this.userService.getUserById(Number(id))
            res.status(201).json({ statusCode: 200, user: user })
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }
}
