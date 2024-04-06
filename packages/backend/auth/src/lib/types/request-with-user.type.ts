import { User } from '@shared';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: User;
}
