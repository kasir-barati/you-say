import { Module } from '@nestjs/common';

import { PrismaService } from './prisma-management.service';

@Module({
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
