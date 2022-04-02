import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from '@you-say/src/shared/libs/tapsa-crud';
import { CreateUserRequestDto } from './dto';
import bcryptjs from 'bcryptjs';

import { UserWithRelations } from './types/user.type';
import { UserRepository } from './users-repository';
import { nanoidGenerator } from '@you-say/src/shared/helpers/nanoid-generator.helper';

@Injectable()
export class UsersService extends BaseService<
    UserWithRelations,
    Prisma.UserCreateArgs,
    Prisma.UserUpdateArgs,
    Prisma.UserUpdateManyArgs,
    Prisma.UserFindFirstArgs,
    Prisma.UserFindManyArgs,
    Prisma.UserDeleteArgs,
    Prisma.UserDeleteManyArgs
> {
    constructor(public userRepository: UserRepository) {
        super(userRepository, {
            DUPLICATE: 'Duplicate user',
            NOT_FOUND: 'User not found',
        });
    }

    async create(
        createUserRequestDto: CreateUserRequestDto,
    ): Promise<UserWithRelations> {
        const hashedPassword = this.hashPassword(
            createUserRequestDto.password,
        );
        const { avatar, email, username, family, name } =
            createUserRequestDto;

        return this.add({
            data: {
                id: nanoidGenerator(),
                hashedPassword: await hashedPassword,
                avatar,
                email,
                username,
                family,
                name,
            },
        });
    }

    comparePassword({
        plainTextPassword,
        hashedPassword,
    }: {
        plainTextPassword: string;
        hashedPassword: string;
    }) {
        return bcryptjs.compare(plainTextPassword, hashedPassword);
    }

    async hashPassword(plainTextPassword: string): Promise<string> {
        const salt = bcryptjs.genSalt(10);
        const hashedPassword = bcryptjs.hash(
            plainTextPassword,
            await salt,
        );

        return await hashedPassword;
    }
}
