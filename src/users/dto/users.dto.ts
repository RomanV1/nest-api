import { IsDefined, IsEmail, IsString, Length, MinLength } from 'class-validator'
// import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({
        default: 'user',
    })
    @IsString()
    @IsDefined()
    @Length(3, 20)
    login: string

    @ApiProperty({
        default: 'user@gmail.com',
    })
    @IsString()
    @IsDefined()
    @IsEmail()
    @MinLength(5)
    email: string

    @ApiProperty({
        default: '12345678',
    })
    @IsString()
    @IsDefined()
    @MinLength(8)
    password: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
