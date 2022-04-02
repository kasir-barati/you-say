import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@you-say/src/prisma/prisma.service';
import { BasePrismaRepository } from '@you-say/src/shared/libs/tapsa-repository';
import { UserWithRelations } from './types/user.type';

@Injectable()
export class UserRepository extends BasePrismaRepository<
    UserWithRelations,
    Prisma.UserCreateArgs,
    Prisma.UserUpdateArgs,
    Prisma.UserUpdateManyArgs,
    Prisma.UserFindFirstArgs,
    Prisma.UserFindManyArgs,
    Prisma.UserDeleteArgs,
    Prisma.UserDeleteManyArgs
> {
    constructor(public readonly prismaService: PrismaService) {
        super(prismaService.user);
    }
}
