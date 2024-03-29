import axios from 'axios';
import { createBaseQuery } from './create-base-query.api';
// TODO: Fix VSCode's error: Cannot find module '@shared' or its corresponding type declarations.ts(2307)
import { BaseQueryApi } from '@reduxjs/toolkit/dist/query';
import {
  SinonMock,
  SinonMockType,
  generateRandomString,
} from '@shared';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);
jest.mock('../store/auth-slice.api', () => ({
  userSignedOut: jest.fn().mockReturnValue({ type: 'signOut' }),
}));

// TODO: Do not have any coverage for mutex
describe('createBaseQuery', () => {
  let api: SinonMockType<BaseQueryApi>;
  const extraOptions = {};
  const baseUrl = 'http://test.com';

  beforeAll(() => {
    api = SinonMock.with<BaseQueryApi>({});
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL =
      'http://localhost:3001';
  });

  it('should makes successful request', async () => {
    const url = `/${generateRandomString()}`;
    const data = { something: generateRandomString() };
    mockedAxios.request.mockResolvedValue({
      status: 200,
      data,
    });
    const query = createBaseQuery(baseUrl);

    const result = await query(url, api, extraOptions);

    expect(result.data).toStrictEqual(data);
  });

  it.each<number>([401, 403])(
    'should handle %d error and retries request with new refresh token',
    async (httpStatusCode) => {
      const data = { something: generateRandomString() };
      mockedAxios.request
        .mockRejectedValueOnce({
          response: { status: httpStatusCode },
        })
        .mockResolvedValueOnce({ status: 200, data });
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data });
      const query = createBaseQuery(baseUrl);

      const result = await query('/test', api, extraOptions);

      expect(mockedAxios.get).toHaveBeenCalledWith('auth/refresh', {
        withCredentials: true,
        baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      });
      expect(result.data).toStrictEqual(data);
    },
  );

  it('should return error object if reauth fails', async () => {
    const data = { something: generateRandomString() };
    mockedAxios.request.mockRejectedValueOnce({
      response: { status: 401 },
      message: 'axios error message',
    });
    mockedAxios.get.mockResolvedValueOnce({ status: 500, data });
    const query = createBaseQuery(baseUrl);

    const result = await query('/test', api, extraOptions);

    expect(mockedAxios.get).toHaveBeenCalledWith('auth/refresh', {
      withCredentials: true,
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    });
    expect(api.dispatch.callCount).toBe(1);
    expect(api.dispatch.calledWith({ type: 'signOut' })).toBeTruthy();
    expect(result).toStrictEqual({
      error: { status: 401, data: 'axios error message' },
    });
  });
});
