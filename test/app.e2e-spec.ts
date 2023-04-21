import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/dto/user.entity';
import { plainToInstance } from 'class-transformer';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
        await app.init();
    });

    describe('/users (GET)', () => {
        it('/ (GET) Ok', () => {
            return request(app.getHttpServer())
                .get('/users/')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });

        it('/:id (GET) Ok', () => {
            return request(app.getHttpServer())
                .get('/users/3')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(plainToInstance(User, res.body)).toBeInstanceOf(User);
                });
        });

        it('/:id (GET) Bad Request', () => {
            return request(app.getHttpServer()).get('/users/helloWorld').expect('Content-Type', /json/).expect(400).expect({
                statusCode: 400,
                message: 'id must be a number',
                error: 'Bad Request',
            });
        });
    });

    describe('/users (POST)', () => {
        it('/ (POST) Created', () => {
            return request(app.getHttpServer())
                .post('/users')
                .send({ login: 'uuser11', email: 'uuser11@gmail.com', password: 'aasadasadaaaa' })
                .expect('Content-Type', /json/)
                .expect(201)
                .then((res) => {
                    expect(plainToInstance(User, res.body)).toBeInstanceOf(User);
                });
        });

        it('/ (POST) Bad Request', () => {
            return request(app.getHttpServer())
                .post('/users')
                .expect('Content-Type', /json/)
                .expect(400)
                .then((res) => {
                    expect(res.body).toEqual({
                        statusCode: 400,
                        message: [
                            'login should not be null or undefined',
                            'login must be longer than or equal to 3 characters',
                            'login must be a string',
                            'email should not be null or undefined',
                            'email must be longer than or equal to 5 characters',
                            'email must be an email',
                            'email must be a string',
                            'password should not be null or undefined',
                            'password must be longer than or equal to 8 characters',
                            'password must be a string',
                        ],
                        error: 'Bad Request',
                    });
                });
        });
    });

    describe('/users (DELETE)', () => {
        it('/:id (DELETE) Ok', async () => {
            const res = await request(app.getHttpServer()).post('/users').send({ login: 'aaaaaaaasss', email: 'ddddsss@gmail.com', password: 'aasadasadaaaa' });
            return request(app.getHttpServer())
                .delete(`/users/${res.body.user.id}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(plainToInstance(User, res.body)).toBeInstanceOf(User);
                });
        });

        it('/:id (DELETE) Not Found', async () => {
            return request(app.getHttpServer())
                .delete('/users/1010101')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body).toEqual({
                        statusCode: 404,
                        message: 'User is not found',
                        error: 'Not Found',
                    });
                });
        });

        it('/:id (DELETE) Bad Request', async () => {
            return request(app.getHttpServer())
                .delete('/users/1a')
                .expect('Content-Type', /json/)
                .expect(400)
                .then((res) => {
                    expect(res.body).toEqual({
                        statusCode: 400,
                        message: 'id must be a number',
                        error: 'Bad Request',
                    });
                });
        });
    });

    describe('/users (PATCH)', () => {
        it('/:id (PATCH) Ok', async () => {
            return request(app.getHttpServer())
                .patch(`/users/3`)
                .send({ login: 'user', email: 'user@gmail.com', password: '123456789' })
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.user.login).toBe('user');
                    expect(res.body.user.email).toBe('user@gmail.com');
                    expect(res.body.user.password).not.toBe('123456789');
                });
        });

        it('/:id (PATCH) Not Found', async () => {
            return request(app.getHttpServer())
                .patch(`/users/10101001`)
                .send({ login: 'user', email: 'user@gmail.com', password: '123456789' })
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body).toEqual({
                        statusCode: 404,
                        message: 'User is not found',
                        error: 'Not Found',
                    });
                });
        });

        it('/:id (PATCH) Bad Request', async () => {
            return request(app.getHttpServer())
                .patch(`/users/3`)
                .send({ login: 'u', email: 'u', password: '1' })
                .expect('Content-Type', /json/)
                .expect(400)
                .then((res) => {
                    expect(res.body).toEqual({
                        statusCode: 400,
                        message: [
                            'login must be longer than or equal to 3 characters',
                            'email must be longer than or equal to 5 characters',
                            'email must be an email',
                            'password must be longer than or equal to 8 characters',
                        ],
                        error: 'Bad Request',
                    });
                });
        });

        it('/:id (PATCH) Bad Request', async () => {
            return request(app.getHttpServer())
                .patch(`/users/3`)
                .expect('Content-Type', /json/)
                .expect(400)
                .then((res) => {
                    expect(res.body).toEqual({
                        statusCode: 400,
                        message: 'Request body must not be empty',
                        error: 'Bad Request',
                    });
                });
        });
    });
});
