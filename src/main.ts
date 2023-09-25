import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function main() {
    const app: INestApplication = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    const configService: ConfigService = new ConfigService();

    const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder().setTitle('nest-api').setDescription('nest-api description').setVersion('1.0.0').addTag('API').build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);

    await app.listen(configService.get<number>('PORT') ?? 8000);
}

main().then(() => console.log(`[Server] Running \n[Server] Port = ${process.env.PORT || 8000}`));
