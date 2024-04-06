import { Injectable } from '@nestjs/common';
import { Role } from '@shared';
import { NextFunction, Response } from 'express';
import { RequestWithUser } from './types/request-with-user.type';

@Injectable()
export class RoleValidatorMiddlewareFactory {
  create(
    expectedRoles: Role[],
  ): (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => void {
    return (req, res, next) => {
      if (
        !req.user ||
        !req?.user?.roles ||
        !Array.isArray(req?.user?.roles) ||
        !expectedRoles.some((expectedRole) =>
          req?.user?.roles?.includes(expectedRole),
        )
      ) {
        res.status(401);
        return;
      }

      next();
    };
  }
}
