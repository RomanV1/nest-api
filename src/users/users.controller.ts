import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { UsersService } from './users.service'
import { CreateUserDto, UpdateUserDto } from './dto/users.dto'

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get()
    async getUsers(@Res() res: Response) {
        try {
            const users = await this.userService.getUsers()
            if (!users.length) {
                res.status(404).json({ statusCode: 404, message: 'Users not found', error: 'Not Found' })
                return
            }

            res.status(200).json(users)
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    @Post()
    async createUser(@Res() res: Response, @Body() user: CreateUserDto) {
        try {
            if (await this.userService.isUserExist(user)) {
                res.status(409).json({ statusCode: 409, message: 'User already exist. Change your login or email', error: 'Conflict' })
                return
            }

            const createdUser = await this.userService.createUser(user)
            res.status(201).json({ statusCode: 201, message: 'User has been created', createdUser: createdUser })
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    @Get(':id')
    async getUserById(@Res() res: Response, @Param('id') id: number) {
        try {
            if (!Number(id)) {
                res.status(400).json({ statusCode: 400, message: 'id must be a number', error: 'Bad Request' })
                return
            }

            const user = await this.userService.getUserById(id)
            if (user === null) {
                res.status(404).json({ statusCode: 404, message: 'User is not found', error: 'Not found' })
                return
            }

            res.status(201).json({ statusCode: 200, user: user })
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    @Delete(':id')
    async deleteUser(@Res() res: Response, @Param('id') id: number) {
        try {
            if (!Number(id)) {
                res.status(400).json({ statusCode: 400, message: 'id must be a number', error: 'Bad Request' })
                return
            }

            const user = await this.userService.getUserById(id)
            if (user === null) {
                res.status(404).json({ statusCode: 404, message: 'User is not found', error: 'Not found' })
                return
            }

            const deletedUser = await this.userService.deleteUser(id)
            res.status(201).json({ statusCode: 200, message: 'User has been deleted', deletedUser: deletedUser })
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }

    @Patch(':id')
    async updateUser(@Res() res: Response, @Param('id') id: number, @Body() user: UpdateUserDto) {
        try {
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }
}
