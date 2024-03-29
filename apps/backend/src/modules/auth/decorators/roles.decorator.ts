import {
  applyDecorators,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@shared';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RoleGuard),
  );
};
