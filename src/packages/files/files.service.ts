import { Injectable } from '@nestjs/common';
import { Prisma } from '.prisma/client';

import { BaseService } from '@you-say/src/shared/libs/tapsa-crud';
import { FileWithRelations } from './files.type';
import { FilesPrismaRepository } from './files.repository';
import { PrismaService } from '@you-say/src/shared/modules/prisma-management/prisma-management.service';

@Injectable()
export class FilesService extends BaseService<
    FileWithRelations,
    Prisma.FileCreateArgs,
    Prisma.FileUpdateArgs,
    Prisma.FileUpdateManyArgs,
    Prisma.FileFindFirstArgs,
    Prisma.FileFindManyArgs,
    Prisma.FileDeleteArgs,
    Prisma.FileDeleteManyArgs
> {
    constructor(
        public prismaService: PrismaService,
        public fileRepository: FilesPrismaRepository,
    ) {
        super(fileRepository, {
            NOT_FOUND: 'فایل مورد نظر وجود ندارد',
            DUPLICATE: 'فایل وارد شده تکراری است',
        });
    }
}
