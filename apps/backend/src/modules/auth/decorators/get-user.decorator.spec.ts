import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { getParamDecoratorFactory } from '../../../shared/helpers/get-param-decorator-factory.helper';
import { Role } from '../auth.type';
import { GetUser } from './get-user.decorator';

describe('GetUser', () => {
  it("should return the decoded user's JWT payload if key is not specified", () => {
    const requestMock = <Request>{
      user: { roles: [Role.PostCreator] },
    };
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
      const requestMock = <Request>{
        user: { roles },
      };
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
    const requestMock = <Request>{
      user: {},
    };
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
