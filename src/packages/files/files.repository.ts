import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';

import { BasePrismaRepository } from '@you-say/src/shared/libs/tapsa-repository';
import { PrismaService } from '@you-say/src/shared/modules/prisma-management/prisma-management.service';
import { FileWithRelations } from './files.type';

@Injectable()
export class FilesPrismaRepository extends BasePrismaRepository<
    FileWithRelations,
    Prisma.FileCreateArgs,
    Prisma.FileUpdateArgs,
    Prisma.FileUpdateManyArgs,
    Prisma.FileFindFirstArgs,
    Prisma.FileFindManyArgs,
    Prisma.FileDeleteArgs,
    Prisma.FileDeleteManyArgs
> {
    constructor(public readonly prismaService: PrismaService) {
        super(prismaService.file);
    }
}
