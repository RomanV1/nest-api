import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/users.dto';

describe('UsersService', () => {
    let usersService: UsersService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, PrismaService],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
        expect(prismaService).toBeDefined();
    });

    describe('getUsers', () => {
        it('should return an array of users', async () => {
            const mockUsers: User[] = [
                { id: 1, email: '123@gmail.com', login: '321', password: '123123', createdAt: new Date() },
                { id: 2, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() },
            ];

            jest.spyOn(prismaService.user, 'findMany').mockResolvedValueOnce(mockUsers);

            const users = await usersService.getUsers();

            expect(users).toEqual(mockUsers);
        });

        it('should return error', async () => {
            const eMessage = 'some error';

            jest.spyOn(prismaService.user, 'findMany').mockRejectedValueOnce(new Error(eMessage));

            try {
                await usersService.getUsers();
            } catch (e) {
                expect(e.message).toEqual(`class UsersService method getUsers \n${eMessage}`);
            }
        });

        describe('createUser', () => {
            const mockUser: User = { id: 2, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() };

            it('should return created user', async () => {
                jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(mockUser);

                const users = await usersService.createUser(mockUser);

                expect(users).toEqual(mockUser);
            });

            it('should return error', async () => {
                const eMessage = 'some error';

                jest.spyOn(prismaService.user, 'create').mockRejectedValueOnce(new Error(eMessage));

                try {
                    await usersService.createUser(mockUser);
                } catch (e) {
                    expect(e.message).toEqual(`class UsersService method createUser \n${eMessage}`);
                }
            });
        });

        describe('createHash', () => {
            const password: string = '1234567890';

            it('should return a hashed password', async () => {
                jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('sad');

                const hash = await usersService.createHash(password);

                expect(hash).not.toEqual(password);
            });

            it('should return error', async () => {
                const eMessage = 'some error';

                jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error(eMessage));

                try {
                    await usersService.createHash(password);
                } catch (e) {
                    expect(e.message).toEqual(`class UsersService method createHash \n${eMessage}`);
                }
            });
        });

        describe('isUserExist', () => {
            const mockUser: User = { id: 2, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() };

            it('should find user and return true', async () => {
                jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(mockUser);

                const user = await usersService.isUserExist(mockUser);

                expect(user).toEqual(true);
            });

            it('should return false', async () => {
                jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null);

                const user = await usersService.isUserExist(mockUser);

                expect(user).toEqual(false);
            });

            it('should return error', async () => {
                const eMessage = 'some error';

                jest.spyOn(prismaService.user, 'findFirst').mockRejectedValueOnce(new Error(eMessage));

                try {
                    await usersService.isUserExist(mockUser);
                } catch (e) {
                    expect(e.message).toEqual(`class UsersService method isUserExist \n${eMessage}`);
                }
            });
        });

        describe('getUserById', () => {
            const mockUser: User = { id: 2, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() };

            it('should find user', async () => {
                jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(mockUser);

                const user = await usersService.getUserById(2);

                expect(user).toEqual(mockUser);
            });

            it('should return null', async () => {
                jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null);

                const user = await usersService.getUserById(2);

                expect(user).toEqual(null);
            });

            it('should return error', async () => {
                const eMessage = 'some error';

                jest.spyOn(prismaService.user, 'findFirst').mockRejectedValueOnce(new Error(eMessage));

                try {
                    await usersService.getUserById(2);
                } catch (e) {
                    expect(e.message).toEqual(`class UsersService method getUserById \n${eMessage}`);
                }
            });
        });

        describe('deleteUser', () => {
            const mockUser: User = { id: 2, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() };

            it('should delete user', async () => {
                jest.spyOn(prismaService.user, 'delete').mockResolvedValueOnce(mockUser);

                const user = await usersService.deleteUser(2);

                expect(user).toEqual(mockUser);
            });

            it('should return null', async () => {
                jest.spyOn(prismaService.user, 'delete').mockResolvedValueOnce(null);

                const user = await usersService.deleteUser(2);

                expect(user).toEqual(null);
            });

            it('should return error', async () => {
                const eMessage = 'some error';

                jest.spyOn(prismaService.user, 'delete').mockRejectedValueOnce(new Error(eMessage));

                try {
                    await usersService.deleteUser(2);
                } catch (e) {
                    expect(e.message).toEqual(`class UsersService method deleteUser \n${eMessage}`);
                }
            });
        });

        describe('updateUser', () => {
            const mockUser: UpdateUserDto = { email: 'asd@gmail.com', login: '123' };
            const mockUpdatedUser: User = { id: 2, email: 'asd@gmail.com', login: '123', password: 'asdji1n', createdAt: new Date() };

            it('should return updated user', async () => {
                jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(mockUpdatedUser);

                const user = await usersService.updateUser(2, mockUser);

                expect(user).toEqual(mockUpdatedUser);
            });

            it('should return null', async () => {
                jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(null);

                const user = await usersService.updateUser(2, mockUser);

                expect(user).toEqual(null);
            });

            it('should return error', async () => {
                const eMessage = 'some error';

                jest.spyOn(prismaService.user, 'update').mockRejectedValueOnce(new Error(eMessage));

                try {
                    await usersService.updateUser(2, mockUser);
                } catch (e) {
                    expect(e.message).toEqual(`class UsersService method updateUser \n${eMessage}`);
                }
            });
        });
    });
});
