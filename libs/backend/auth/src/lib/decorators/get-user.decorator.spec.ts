import { getParamDecoratorFactory } from '@backend/common';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '@shared';
import { RequestWithUser } from '../types/request-with-user.type';
import { GetUser } from './get-user.decorator';

describe('GetUser', () => {
  it("should return the decoded user's JWT payload if key is not specified", () => {
    const requestMock = {
      user: { roles: [Role.PostCreator] },
    } as RequestWithUser;
    const executionContext = <ExecutionContext>{
      switchToHttp: () => ({
        getRequest: () => requestMock,
      }),
    };
    const factory = getParamDecoratorFactory(GetUser);

    const user = factory(null, executionContext);

    expect(user).toStrictEqual({ roles: [Role.PostCreator] });
  });

  it.each<Role[]>([
    [Role.PostCreator],
    [Role.PostCreator, Role.PostReader],
  ])(
    "should return the roles extracted from JWT's payload if we particularly asked for 'roles' key",
    (...roles) => {
      const requestMock = {
        user: { roles },
      } as RequestWithUser;
      const executionContext = <ExecutionContext>{
        switchToHttp: () => ({
          getRequest: () => requestMock,
        }),
      };
      const factory = getParamDecoratorFactory(GetUser);

      const userRoles = factory('roles', executionContext);

      expect(userRoles).toStrictEqual(roles);
    },
  );

  it('should throw "User does not have the specified key!" if the specified key does not exist in the decoded JWT payload.', () => {
    const requestMock = {
      user: {},
    } as RequestWithUser;
    const executionContext = <ExecutionContext>{
      switchToHttp: () => ({
        getRequest: () => requestMock,
      }),
    };
    const factory = getParamDecoratorFactory(GetUser);

    expect(() => factory('roles', executionContext)).toThrow(
      'User does not have the specified key!',
    );
  });

  it('should throw "User does not exist in the request!" if req.user is undefined', () => {
    const executionContext = <ExecutionContext>{
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    };
    const factory = getParamDecoratorFactory(GetUser);

    expect(() => factory('roles', executionContext)).toThrow(
      'User does not exist in the request!',
    );
  });
});
