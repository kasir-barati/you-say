import { File, Mimetype } from '@prisma/client';

export type FileWithRelations = File & {
    Mimetype: Mimetype;
};
