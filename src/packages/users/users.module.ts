import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users-repository';
import { PrismaModule } from '@you-say/src/shared/modules/prisma-management/prisma-management.module';
import { PrismaService } from '@you-say/src/prisma/prisma.service';

@Module({
    imports: [PrismaModule],
    controllers: [UsersController],
    providers: [UsersService, UserRepository, PrismaService],
    exports: [UsersService],
})
export class UsersModule {}
