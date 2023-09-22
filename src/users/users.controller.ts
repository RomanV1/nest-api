import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, BaseUserResponse } from './dto/users.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from './dto/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    @ApiResponse({
        status: 200,
        type: [UserEntity],
        description: 'Get all users',
    })
    async getUsers(): Promise<UserEntity[]> {
        return this.userService.getUsers();
    }

    @Post()
    @ApiResponse({
        status: 201,
        type: BaseUserResponse,
        description: 'Created user',
    })
    async createUser(@Body() user: CreateUserDto): Promise<BaseUserResponse> {
        const createdUser: UserEntity = await this.userService.createUser(user);
        return {
            message: 'User has been created',
            user: createdUser,
        };
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        type: UserEntity,
        description: 'Get user by id',
    })
    async getUserById(@Param('id') id: number): Promise<UserEntity> {
        if (isNaN(id)) {
            throw new BadRequestException('id must be a number');
        }

        const user = await this.userService.getUserById(id);
        if (user === null) {
            throw new NotFoundException('User is not found');
        }

        return plainToInstance(UserEntity, user);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        type: BaseUserResponse,
        description: 'Delete user by id',
    })
    async deleteUser(@Param('id') id: number): Promise<BaseUserResponse> {
        if (isNaN(id)) {
            throw new BadRequestException('id must be a number');
        }

        const findUser = await this.userService.getUserById(id);
        if (findUser === null) {
            throw new NotFoundException('User is not found');
        }

        const deletedUser = await this.userService.deleteUser(id);
        return plainToInstance(BaseUserResponse, { message: 'User has been deleted', user: deletedUser });
    }

    @Patch(':id')
    @ApiResponse({
        status: 200,
        type: BaseUserResponse,
        description: 'Update user by id',
    })
    async updateUser(@Param('id') id: number, @Body() user: UpdateUserDto): Promise<BaseUserResponse> {
        if (isNaN(id)) {
            throw new BadRequestException('id must be a number');
        }

        if (user.login === undefined && user.email === undefined && user.password === undefined) {
            throw new BadRequestException('Request body must not be empty');
        }

        const findUser = await this.userService.getUserById(id);
        if (findUser === null) {
            throw new NotFoundException('User is not found');
        }

        if (user.password !== undefined) {
            user.password = await this.userService.createHash(user.password);
        }

        const updatedUser = await this.userService.updateUser(id, user);
        return plainToInstance(BaseUserResponse, { message: 'User has been updated', user: updatedUser });
    }
}
