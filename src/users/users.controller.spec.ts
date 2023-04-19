import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BaseUserResponse, UpdateUserDto } from './dto/users.dto';

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService, PrismaService],
        }).compile();

        usersController = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(usersController).toBeDefined();
        expect(usersService).toBeDefined();
    });

    describe('getUsers', () => {
        const users: User[] = [
            { id: 1, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() },
            { id: 2, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() },
        ];

        it('should return all users', async () => {
            jest.spyOn(usersService, 'getUsers').mockResolvedValue(users);

            const result = await usersController.getUsers();
            expect(result).toEqual(users);
        });

        it('should return 404 not found', async () => {
            jest.spyOn(usersService, 'getUsers').mockResolvedValue([]);

            try {
                await usersController.getUsers();
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toBe('Users is not found');
            }
        });
    });

    describe('createUser', () => {
        const createdUser: User = { id: 1, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() };

        it('should return created user', async () => {
            jest.spyOn(usersService, 'isUserExist').mockResolvedValue(false);
            jest.spyOn(usersService, 'createUser').mockResolvedValue(createdUser);

            const result = await usersController.createUser(createdUser);
            expect(result).toEqual(plainToInstance(BaseUserResponse, { message: 'User has been created', user: createdUser }));
        });

        it('should return 400 bad request', async () => {
            jest.spyOn(usersService, 'isUserExist').mockResolvedValue(true);

            try {
                await usersController.createUser(createdUser);
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException);
                expect(err.message).toBe('User already exist. Change your login or email');
            }
        });
    });

    describe('getUserById', () => {
        const user: User = { id: 1, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() };

        it('should return user', async () => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(user);

            const result = await usersController.getUserById(1);
            expect(result).toEqual(user);
        });

        it('should return 404 not found', async () => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);

            try {
                await usersController.getUserById(1);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toBe('User is not found');
            }
        });
    });

    describe('deleteUser', () => {
        const deletedUser: User = { id: 1, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() };

        it('should return deleted user', async () => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(deletedUser);
            jest.spyOn(usersService, 'deleteUser').mockResolvedValue(deletedUser);

            const result = await usersController.deleteUser(1);
            expect(result).toEqual(plainToInstance(BaseUserResponse, { message: 'User has been deleted', user: deletedUser }));
        });

        it('should return 404 not found', async () => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);

            try {
                await usersController.deleteUser(1);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toBe('User is not found');
            }
        });
    });

    describe('updateUser', () => {
        const user: User = { id: 1, email: 'asd@gmail.com', login: 'asd', password: 'asdji1n', createdAt: new Date() };
        const body: UpdateUserDto = { login: 'roma', email: 'roma@gmail.com' };
        const updatedUser: User = { ...user, login: body.login, email: body.email };

        it('should return updated user', async () => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(user);
            jest.spyOn(usersService, 'updateUser').mockResolvedValue(updatedUser);

            const result = await usersController.updateUser(1, body);
            expect(result).toEqual(plainToInstance(BaseUserResponse, { message: 'User has been updated', user: updatedUser }));
        });

        it('should return 404 not found', async () => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);

            try {
                await usersController.updateUser(1, user);
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toBe('User is not found');
            }
        });

        it('should return 400 bad request: Empty body', async () => {
            try {
                await usersController.updateUser(1, {});
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException);
                expect(err.message).toBe('Request body must not be empty');
            }
        });

        it('should return updated user with new hash', async () => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(user);
            jest.spyOn(usersService, 'createHash').mockResolvedValue('1111111');
            jest.spyOn(usersService, 'updateUser').mockResolvedValue({ ...updatedUser, password: '1111111' });

            const result = await usersController.updateUser(1, body);
            expect(result).toEqual(plainToInstance(BaseUserResponse, { message: 'User has been updated', user: { ...updatedUser, password: '1111111' } }));
        });
    });
});
