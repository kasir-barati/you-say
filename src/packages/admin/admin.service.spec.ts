import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@you-say/src/shared/modules/prisma-management/prisma-management.module';
import { AdminPrismaRepository } from './admin.repository';
import { AdminSerializer } from './admin.serializer';
import { AdminService } from './admin.service';

describe('AdminService', () => {
    let adminService: AdminService;
    const adminSerializer: Partial<AdminSerializer> = {};
    const adminPrismaRepository: Partial<AdminPrismaRepository> = {
        add({ data }) {
            return Promise.resolve(data as any);
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [
                AdminService,
                {
                    provide: AdminSerializer,
                    useValue: adminSerializer,
                },
                {
                    provide: AdminPrismaRepository,
                    useValue: adminPrismaRepository,
                },
            ],
        }).compile();

        adminService = module.get<AdminService>(AdminService);
    });

    it('should be defined', () => {
        expect(adminService).toBeDefined();
    });

    it('should create user', async () => {
        const createdAt = new Date();
        const updatedAt = new Date();
        const user = {
            id: '123456789',
            userId: '123456879',
            createdAt,
            updatedAt,
        };

        expect(
            await adminService.add({
                data: user,
            }),
        ).toEqual(user);
    });
});
