import { Admin, File, User } from '@prisma/client';

export type AdminWithRelations = Admin & {
    User: User;
    Files: File[];
};
