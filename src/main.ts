import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import dotenv, { config } from 'dotenv'
config()

async function main() {
    const app = await NestFactory.create(AppModule)
    await app.listen(process.env.PORT || 8000)
}

main().then(() => console.log(`[Server] Running \n[Server] Port = ${process.env.PORT || 8000}`))
