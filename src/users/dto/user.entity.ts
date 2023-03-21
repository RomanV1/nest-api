import { ApiProperty } from '@nestjs/swagger'

export class User {
    @ApiProperty({ example: 1 })
    id: number

    @ApiProperty({ example: 'user' })
    login: string

    @ApiProperty({ example: 'user@gmail.com' })
    email: string

    @ApiProperty({ example: '$2a$09$Q9Xv8oNYzIAO6SgtxGHxoOsLh8WFT5i3Cbzw7D3sxidUQiL88eY6y' })
    password: string

    @ApiProperty({ example: '2023-03-18T00:35:40.390Z' })
    createdAt: string
}
