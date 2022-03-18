import { Module } from '@nestjs/common';

import { PrismaModule } from '@you-say/src/shared/modules/prisma-management/prisma-management.module';
import { AdminPrismaRepository } from './admin.repository';
import { AdminSerializer } from './admin.serializer';
import { AdminService } from './admin.service';

@Module({
    imports: [PrismaModule],
    providers: [AdminService, AdminSerializer, AdminPrismaRepository],
    exports: [AdminService, AdminSerializer],
})
export class AdminModule {}
