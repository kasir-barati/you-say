import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlphanumeric,
    IsEmail,
    IsOptional,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

import {
    passwordAtLeastTwoLowerCaseLetter,
    passwordAtLeastTwoNumber,
    passwordAtLeastTwoUpperCaseLetter,
    passwordSpecialCharRegex,
    usernameRegex,
} from '@you-say/src/shared/contracts/statics-values/static-values';
import { Match } from '@you-say/src/shared/decorators/match.decorator';

export class CreateUserRequestDto {
    @ApiProperty({
        name: 'name',
        title: 'name',
        description: "User's name should be alphanumeric",
        example: 'Kasir',
        nullable: true,
        isArray: false,
        minLength: 4,
        maxLength: 200,
        type: String,
    })
    @IsOptional()
    @MinLength(4)
    @MaxLength(200)
    @IsAlphanumeric()
    name?: string;

    @ApiProperty({
        name: 'family',
        title: 'family',
        description: "User's family should be alphanumeric",
        example: 'Barati',
        isArray: false,
        nullable: true,
        minLength: 4,
        maxLength: 200,
        type: String,
    })
    @IsOptional()
    @MinLength(4)
    @MaxLength(200)
    @IsAlphanumeric()
    family?: string;

    @ApiProperty({
        name: 'email',
        title: 'email',
        description: "User's email should be unique",
        example: 'kasir.barati@gmail.com',
        isArray: false,
        required: true,
        maxLength: 320,
        type: String,
    })
    @IsEmail()
    @MaxLength(320)
    email: string;

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
        type: String,
        isArray: false,
        required: true,
    })
    @MinLength(8)
    @Matches(passwordSpecialCharRegex)
    @Matches(passwordAtLeastTwoLowerCaseLetter)
    @Matches(passwordAtLeastTwoUpperCaseLetter)
    @Matches(passwordAtLeastTwoNumber)
    password: string;

    @ApiProperty({
        name: 'confirmPassword',
        title: 'confirmPassword',
        description:
            'User have to provide the entered password again',
        example: '123aBBc@#!',
        type: String,
        isArray: true,
        required: true,
    })
    @Match(
        CreateUserRequestDto,
        (CreateUserRequestDto) => CreateUserRequestDto.password,
    )
    confirmPassword: string;

    @ApiProperty({
        name: 'avatar',
        title: 'avatar',
        description:
            "User's avatar should be the returned id for the uploaded avatar",
        example: 'as548478da651sd544a54ds5a4-original-filename.png',
        isArray: false,
        nullable: true,
        type: String,
        minLength: 15,
        maxLength: 100,
    })
    @MinLength(15)
    @MaxLength(100)
    // FIXME: https://godly-weapon.atlassian.net/browse/YS-19
    avatar: string;
}
