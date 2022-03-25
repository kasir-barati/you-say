import { Admin, File, Mimetype } from '@prisma/client';

export type FileWithRelations = File & {
    Admin: Admin;
    Mimetype: Mimetype;
};
