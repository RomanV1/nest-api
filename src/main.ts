import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from 'dotenv'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
config()

async function main() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

    const config = new DocumentBuilder().setTitle('nest-api').setDescription('nest-api description').setVersion('1.0.0').addTag('API').build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/docs', app, document)

    await app.listen(process.env.PORT || 8000)
}

main().then(() => console.log(`[Server] Running \n[Server] Port = ${process.env.PORT || 8000}`))
