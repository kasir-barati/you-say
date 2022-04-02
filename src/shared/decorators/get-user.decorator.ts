import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';
import { UserWithRelations } from '@you-say/src/packages/users/types/user.type';

export const GetUser = createParamDecorator(
    (data: any, ctx: ExecutionContext): UserWithRelations => {
        const request = ctx.switchToHttp().getRequest();

        return request.user;
    },
);
