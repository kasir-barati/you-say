import { Module } from '@nestjs/common';

import { PrismaService } from './prisma-management.service';

@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
