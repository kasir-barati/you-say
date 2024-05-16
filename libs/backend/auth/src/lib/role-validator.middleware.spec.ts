import { Role, SinonMock } from '@shared';
import { Response } from 'express';
import { RoleValidatorMiddlewareFactory } from './role-validator.middleware';
import { RequestWithUser } from './types/request-with-user.type';

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
      const requestMock = {
        user: { roles: [expectedRoles[0]] },
      } as RequestWithUser;
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

    middleware({} as RequestWithUser, responseMock, nextMock);

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
      const requestMock = {
        user: { roles: roles as Role[] },
      } as RequestWithUser;

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
    const requestMock = {
      user: {},
    } as RequestWithUser;

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
      middleware({} as RequestWithUser, responseMock, nextMock),
    ).toThrow(Error);
    expect(nextMock).not.toHaveBeenCalled();
  });
});
