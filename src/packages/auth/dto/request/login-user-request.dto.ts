import { ApiProperty } from '@nestjs/swagger';
import { Matches, MaxLength, MinLength } from 'class-validator';

const usernameRegex = /^[\w+\d_\-.]+$/gi;

export class LoginUserRequestDto {
    @ApiProperty({
        name: 'username',
        title: 'username',
        description: `Used regex to validate usernames: ${usernameRegex}, just alphanumeric and '-' , '_', and '.' are allowed.`,
        example: 'kasir_barati',
        type: String,
        isArray: false,
        maxLength: 200,
        minLength: 20,
        required: true,
    })
    @MinLength(20)
    @MaxLength(200)
    @Matches(usernameRegex)
    username: string;

    @ApiProperty({
        name: 'password',
        title: 'password',
        description:
            'Password should follow these rules: at least 2 number, at least 2 upper case letter, at least 2 lower case letter and minimum length o 12',
        example: 'This Is 123.',
        minLength: 12,
        isArray: false,
        required: true,
        type: String,
    })
    passport: string;
}
