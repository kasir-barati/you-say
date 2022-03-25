# Prisma Client

# Image URLs should be handled by Nginx not NestJS/Traefik

For sake of:

-   cache
-   lessen the burthen of handling Files
-   BTW if you wanna use `@nestjs/serve-static` you can do the following and then pictures will be available in the `localhost:port/filename.ext`

    ```ts
    import { join } from 'path';
    import { ServeStaticModule } from '@nestjs/serve-static';
    import { Module } from '@nestjs/common';

    @Module({
        imports: [
            ServeStaticModule.forRoot({
                rootPath: join(process.cwd(), 'static-files'),
                exclude: ['/api*'],
            }),
        ],
        controllers: [],
        providers: [],
    })
    export class AppModule {}
    ```

## Use FKs or Prisma functionality (connect, or create new records with Relation fields)

### Description

We cannot use connect and FKs at the same time, we have to do it through FKs or Prisma client

### Example

```ts
const uploadedFile = await this.filesService.add({
    data: {
        adminUserId: user.id,
        adminId: user.Admin.id,
        url: file.filename,
        mimetypeKey: '',
        size: file.size,
        id: nanoidGenerator(),
    },
});
```

Or

```ts
const uploadedFile = await this.filesService.add({
    data: {
        Admin: {
            connect: {
                userId: user.id,
            },
        },
        url: file.filename,
        Mimetype: {
            connectOrCreate: {
                where: {
                    value: file.mimetype,
                },
                create: {
                    // FIXME: https://github.com/broofa/mime/issues/268
                    key: (mimeType as any).getExtension(
                        file.mimetype,
                    ) as string,
                    value: file.mimetype,
                    maximumSizeInMegabyte: 20,
                },
            },
        },
        size: file.size,
        id: nanoidGenerator(),
    },
});
```

But Why I am saying this? Because I tried the following way and TS yield at me that `never` is not assignable to `string`. And TS error was on `adminUserId` field.

```ts
const uploadedFile = await this.filesService.add({
    data: {
        adminUserId: user.id,
        adminId: user.Admin.id,
        url: file.filename,
        Mimetype: {
            connectOrCreate: {
                where: {
                    value: file.mimetype,
                },
                create: {
                    // FIXME: https://github.com/broofa/mime/issues/268
                    key: (mimeType as any).getExtension(
                        file.mimetype,
                    ) as string,
                    value: file.mimetype,
                    maximumSizeInMegabyte: 20,
                },
            },
        },
        size: file.size,
        id: nanoidGenerator(),
    },
});
```
