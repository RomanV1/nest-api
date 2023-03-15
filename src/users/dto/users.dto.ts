import { IsDefined, IsEmail, IsString, Length, MinLength } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreateUserDto {
    @IsString()
    @IsDefined()
    @Length(3, 20)
    login: string

    @IsString()
    @IsDefined()
    @IsEmail()
    @MinLength(5)
    email: string

    @IsString()
    @IsDefined()
    @MinLength(8)
    password: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
