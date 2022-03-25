import { File, User } from '@prisma/client';
import { AdminWithRelations } from '../../admin.type';

export class AdminRoDto {
    id: string;
    User: User;
    Files: File[];
    createdAt: Date;
    updatedAt: Date;

    constructor(admin: AdminWithRelations) {
        const { Files, User, createdAt, id, updatedAt } = admin;
        this.id = id;
        this.User = User;
        this.Files = Files;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
