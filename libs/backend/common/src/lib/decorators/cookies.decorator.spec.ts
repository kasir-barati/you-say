import { ExecutionContext } from '@nestjs/common';
import { MockedEntityWithSinonStubs, SinonMock } from '@shared';
import { getParamDecoratorFactory } from '../test-utils/get-param-decorator-factory.test-utils';
import { Cookies } from './cookies.decorator';

describe('Cookies', () => {
  let mockContext: MockedEntityWithSinonStubs<ExecutionContext>;

  beforeEach(() => {
    mockContext = SinonMock.with<ExecutionContext>({});
  });

  it('should return all cookies when no data provided', () => {
    const mockRequest = {
      cookies: {
        cookie1: 'value1',
        cookie2: 'value2',
      },
    };
    mockContext.switchToHttp.returns({
      getRequest: () => mockRequest,
    });
    const factory = getParamDecoratorFactory(Cookies);

    const cookies = factory(undefined, mockContext);

    expect(cookies).toEqual(mockRequest.cookies);
  });

  it('should return specified cookie when data provided', () => {
    const mockRequest = {
      cookies: {
        cookie1: 'value1',
        cookie2: 'value2',
      },
    };
    mockContext.switchToHttp.returns({
      getRequest: () => mockRequest,
    });
    const factory = getParamDecoratorFactory(Cookies);

    const cookie = factory('cookie1', mockContext);

    expect(cookie).toEqual('value1');
  });

  it('should return undefined if cookie not found', () => {
    const mockRequest = {
      cookies: {
        cookie1: 'value1',
      },
    };
    mockContext.switchToHttp.returns({
      getRequest: () => mockRequest,
    });
    const factory = getParamDecoratorFactory(Cookies);

    const cookie = factory('cookie2', mockContext);

    expect(cookie).toBeUndefined();
  });
});
