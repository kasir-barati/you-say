import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { User } from '@shared';
import { RequestWithUser } from '../types/request-with-user.type';

export const GetUser = createParamDecorator(
  (key: string, ctx: ExecutionContext): User | unknown => {
    const req: RequestWithUser = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw 'User does not exist in the request!';
    }

    if (key && !user?.[key]) {
      throw 'User does not have the specified key!';
    }

    return key ? user[key] : user;
  },
);
