import { Admin, User } from '@prisma/client';

export type AdminWithRelations = Admin & {
    User: User;
};
