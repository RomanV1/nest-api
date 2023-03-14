import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from 'dotenv'
import { ValidationPipe } from '@nestjs/common'
config()

async function main() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
    await app.listen(process.env.PORT || 8000)
}

main().then(() => console.log(`[Server] Running \n[Server] Port = ${process.env.PORT || 8000}`))
