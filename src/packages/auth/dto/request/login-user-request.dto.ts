import { ApiProperty } from '@nestjs/swagger';
import { Matches, MaxLength, MinLength } from 'class-validator';

import {
    passwordAtLeastTwoLowerCaseLetter,
    passwordAtLeastTwoNumber,
    passwordAtLeastTwoUpperCaseLetter,
    passwordSpecialCharRegex,
    usernameRegex,
} from '@you-say/src/shared/contracts/statics-values/static-values';

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
        description: `Password should be at least 8 character, contains ${passwordSpecialCharRegex}, and be a combination of numbers and words`,
        example: '123aBBc@#!',
        minLength: 12,
        type: String,
        isArray: false,
        required: true,
    })
    @MinLength(12)
    @Matches(passwordSpecialCharRegex)
    @Matches(passwordAtLeastTwoLowerCaseLetter)
    @Matches(passwordAtLeastTwoUpperCaseLetter)
    @Matches(passwordAtLeastTwoNumber)
    password: string;
}
