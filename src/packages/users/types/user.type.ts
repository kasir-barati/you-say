import { Prisma, User } from '@prisma/client';

export type UserWithRelations = User & {
    // FIXME: use AccountWithRelations, and so on and so forth
    Account?: Prisma.AccountArgs;
    Files?: Prisma.FileFindManyArgs;
    Posts?: Prisma.PostFindManyArgs;
};
