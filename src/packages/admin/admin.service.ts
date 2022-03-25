import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';

import { BaseService } from '@you-say/src/shared/libs/tapsa-crud';
import { PrismaService } from '@you-say/src/shared/modules/prisma-management/prisma-management.service';
import { AdminPrismaRepository } from './admin.repository';
import { AdminWithRelations } from './admin.type';

@Injectable()
export class AdminService extends BaseService<
    AdminWithRelations,
    Prisma.AdminCreateArgs,
    Prisma.AdminUpdateArgs,
    Prisma.AdminUpdateManyArgs,
    Prisma.AdminFindFirstArgs,
    Prisma.AdminFindManyArgs,
    Prisma.AdminDeleteArgs,
    Prisma.AdminDeleteManyArgs
> {
    constructor(
        public prismaService: PrismaService,
        public adminRepository: AdminPrismaRepository,
    ) {
        super(adminRepository, {
            NOT_FOUND: 'کاربر وجود ندارد',
            DUPLICATE: 'کاربر تکراری است',
        });
    }
}
