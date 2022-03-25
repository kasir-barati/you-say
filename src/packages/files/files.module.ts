import { Module } from '@nestjs/common';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaModule } from '@you-say/src/shared/modules/prisma-management/prisma-management.module';
import { FilesPrismaRepository } from './files.repository';
import { FilesSerializer } from './files.serializer';

@Module({
    imports: [PrismaModule],
    controllers: [FilesController],
    providers: [FilesService, FilesPrismaRepository, FilesSerializer],
    exports: [FilesPrismaRepository, FilesSerializer, FilesService],
})
export class FilesModule {}
