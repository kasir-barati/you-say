import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MockedEntityWithSinonStubs, Role, SinonMock } from '@shared';
import { RequestWithUser } from '../types/request-with-user.type';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let roleGuard: RoleGuard;
  let reflector: MockedEntityWithSinonStubs<Reflector>;

  beforeEach(() => {
    reflector = SinonMock.of<Reflector>(Reflector);
    roleGuard = new RoleGuard(reflector);
  });

  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });

  it.each<{
    requestUser: Partial<RequestWithUser['user']>;
    expectedRoles: Role[];
  }>([
    {
      requestUser: { sub: 'uuid', roles: [Role.PostReader] },
      expectedRoles: [Role.PostReader],
    },
    {
      requestUser: {
        sub: 'uuid',
        roles: [Role.PostCreator, Role.PostReader],
      },
      expectedRoles: [Role.PostCreator],
    },
  ])(
    'should return true if user has the expected roles',
    ({ requestUser, expectedRoles }) => {
      const context = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => {
          return {
            getRequest: () => ({
              user: requestUser,
            }),
          };
        },
      } as ExecutionContext;
      reflector.getAllAndOverride.returns(expectedRoles);

      const result = roleGuard.canActivate(context);

      expect(result).toBeTruthy();
    },
  );

  it.each<{
    requestUser: Partial<RequestWithUser['user']>;
    expectedRoles: Role[];
  }>([
    {
      requestUser: { sub: 'uuid', roles: [Role.PostCreator] },
      expectedRoles: [Role.PostReader],
    },
    {
      requestUser: {
        sub: 'uuid',
        roles: [Role.PostReader],
      },
      expectedRoles: [Role.PostCreator],
    },
  ])(
    'should return false if user does have the expected roles',
    ({ requestUser, expectedRoles }) => {
      const context = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => {
          return {
            getRequest: () => ({
              user: requestUser,
            }),
          };
        },
      } as ExecutionContext;
      reflector.getAllAndOverride.returns(expectedRoles);

      const result = roleGuard.canActivate(context);

      expect(result).toBeFalsy();
    },
  );

  it('should return true if expectedRoles is empty array', () => {
    const context = {
      getHandler: () => {},
      getClass: () => {},
    } as ExecutionContext;
    reflector.getAllAndOverride.returns([]);

    const result = roleGuard.canActivate(context);

    expect(result).toBeTruthy();
  });

  it('should return true if expectedRoles is undefined', () => {
    const context = {
      getHandler: () => {},
      getClass: () => {},
    } as ExecutionContext;
    reflector.getAllAndOverride.returns(undefined);

    const result = roleGuard.canActivate(context);

    expect(result).toBeTruthy();
  });

  it.each<RequestWithUser['user'] | object>([
    {},
    { roles: [] },
    { roles: 'something else, not array' },
  ])(
    'should return false if request.user is %p -- empty array',
    (requestUser) => {
      const context = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => {
          return {
            getRequest: () => ({
              user: requestUser,
            }),
          };
        },
      } as ExecutionContext;
      reflector.getAllAndOverride.returns([Role.PostReader]);

      const result = roleGuard.canActivate(context);

      expect(result).toBeFalsy();
    },
  );
});
