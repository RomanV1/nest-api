import { IsDefined, IsEmail, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from './user.entity';

export class CreateUserDto {
    @ApiProperty({
        example: 'user',
    })
    @IsString()
    @IsDefined()
    @Length(3, 20)
    login: string;

    @ApiProperty({
        example: 'user@gmail.com',
    })
    @IsString()
    @IsDefined()
    @IsEmail()
    @MinLength(5)
    email: string;

    @ApiProperty({
        example: '12345678',
    })
    @IsString()
    @IsDefined()
    @MinLength(8)
    password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class BaseUserResponse {
    @ApiProperty({ example: 'User has been created/deleted/updated' })
    message: string;

    @ApiProperty({ example: User })
    user: User;
}
