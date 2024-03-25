import { Role } from './role.type';

export interface User {
  sub: string;
  roles: Role[];
}
