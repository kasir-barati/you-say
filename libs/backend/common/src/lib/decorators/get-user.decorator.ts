import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '@shared';
import { RequestWithUser } from '../types/request-with-user.type';

export const GetUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest();

    if (!request.user) {
      throw new InternalServerErrorException(
        `[Error-1aa6b797] User info is missing!`,
      );
    }

    return request.user;
  },
);
