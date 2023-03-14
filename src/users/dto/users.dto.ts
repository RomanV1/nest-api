import { IsEmail, IsString, Length, MinLength } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreateUserDto {
    @IsString()
    @Length(3, 20)
    login: string

    @IsString()
    @IsEmail()
    @MinLength(5)
    email: string

    @IsString()
    @MinLength(8)
    password: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
