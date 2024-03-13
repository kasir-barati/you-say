import { NextFunction, Request, Response } from 'express';
import { Role } from './auth.type';

export class RoleValidatorMiddlewareFactory {
  create(
    expectedRoles: Role[],
  ): (req: Request, res: Response, next: NextFunction) => void {
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
