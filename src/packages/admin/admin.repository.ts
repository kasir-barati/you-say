import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';

import { BasePrismaRepository } from '@you-say/src/shared/libs/tapsa-repository';
import { PrismaService } from '@you-say/src/shared/modules/prisma-management/prisma-management.service';
import { AdminWithRelations } from './admin.type';

@Injectable()
export class AdminPrismaRepository extends BasePrismaRepository<
    AdminWithRelations,
    Prisma.AdminCreateArgs,
    Prisma.AdminUpdateArgs,
    Prisma.AdminUpdateManyArgs,
    Prisma.AdminFindFirstArgs,
    Prisma.AdminFindManyArgs,
    Prisma.AdminDeleteArgs,
    Prisma.AdminDeleteManyArgs
> {
    constructor(public readonly prismaService: PrismaService) {
        super(prismaService.admin);
    }
}
