import { Request, Response } from 'express';
import { SinonMock } from '../../shared/helpers/sinon-mock.helper';
import { Role } from './auth.type';
import { RoleValidatorMiddlewareFactory } from './role-validator.middleware';

describe('RoleValidatorMiddlewareFactory', () => {
  let roleValidatorMiddleware: RoleValidatorMiddlewareFactory;

  beforeEach(() => {
    roleValidatorMiddleware = new RoleValidatorMiddlewareFactory();
  });

  it.each<Role[]>([[Role.PostReader], [Role.PostCreator]])(
    'should call next function when user at least has one of the "%s" roles',
    (...expectedRoles) => {
      const middleware =
        roleValidatorMiddleware.create(expectedRoles);
      const requestMock = <Request>{
        user: { roles: [expectedRoles[0]] },
      };
      const responseMock = {} as Response;
      const nextMock = jest.fn();

      middleware(requestMock, responseMock, nextMock);

      expect(nextMock).toHaveBeenCalledTimes(1);
    },
  );

  it('should return 401 when user does not exists in the request object', () => {
    const middleware = roleValidatorMiddleware.create([
      Role.PostCreator,
    ]);
    const nextMock = jest.fn();
    const responseMock = SinonMock.with<Response>({
      status: jest.fn(),
    });

    middleware({} as Request, responseMock, nextMock);

    expect(responseMock.status).toHaveBeenCalledTimes(1);
    expect(responseMock.status).toHaveBeenCalledWith(401);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it.each<unknown>([1, 'something', null, undefined, 3.14])(
    'should return 401 when user.roles is not array',
    (roles) => {
      const middleware = roleValidatorMiddleware.create([
        Role.PostCreator,
      ]);
      const nextMock = jest.fn();
      const responseMock = SinonMock.with<Response>({
        status: jest.fn(),
      });
      const requestMock = <Request>{
        user: { roles: roles as Role[] },
      };

      middleware(requestMock, responseMock, nextMock);

      expect(responseMock.status).toHaveBeenCalledTimes(1);
      expect(responseMock.status).toHaveBeenCalledWith(401);
      expect(nextMock).not.toHaveBeenCalled();
    },
  );

  it('should return 401 when user.roles is not defined', () => {
    const middleware = roleValidatorMiddleware.create([
      Role.PostCreator,
    ]);
    const nextMock = jest.fn();
    const responseMock = SinonMock.with<Response>({
      status: jest.fn() as Response['status'],
    });
    const requestMock = <Request>{
      user: {},
    };

    middleware(requestMock, responseMock, nextMock);

    expect(responseMock.status).toHaveBeenCalledTimes(1);
    expect(responseMock.status).toHaveBeenCalledWith(401);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('should throw error if caught any as calling middleware', () => {
    const middleware = roleValidatorMiddleware.create([
      Role.PostCreator,
    ]);
    const nextMock = jest.fn();
    const responseMock = SinonMock.with<Response>({
      status: jest.fn(() => {
        throw new Error();
      }),
    });

    expect(() =>
      middleware({} as Request, responseMock, nextMock),
    ).toThrow(Error);
    expect(nextMock).not.toHaveBeenCalled();
  });
});
