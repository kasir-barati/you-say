import { BaseQueryApi } from '@reduxjs/toolkit/dist/query';
import {
  SinonMock,
  SinonMockType,
  generateRandomString,
} from '@shared';
import axios from 'axios';
import {
  AxiosBaseQueryArgs,
  axiosBaseQuery,
} from './axios-base-query.api';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('axiosBaseQuery', () => {
  let api: SinonMockType<BaseQueryApi>;
  const extraOptions = {};

  beforeEach(() => {
    api = SinonMock.with<BaseQueryApi>({});
  });

  it('should make a successful http request when args is string', async () => {
    const baseUrl = 'http://test.com';
    const url = `/${generateRandomString()}`;
    const expectedResult = { data: generateRandomString() };
    mockedAxios.request.mockResolvedValue(expectedResult);
    const query = axiosBaseQuery({ baseUrl, withCredentials: false });

    const result = await query(url, api, extraOptions);

    expect(mockedAxios.request).toHaveBeenCalledWith({
      url,
      method: 'GET',
      data: undefined,
      baseURL: baseUrl,
      params: undefined,
      withCredentials: false,
    });
    expect(result).toStrictEqual(expectedResult);
  });

  it.each<AxiosBaseQueryArgs>([
    { url: '/some/url', body: { some: 1 }, method: 'POST' },
    {
      url: '/funny/url',
      body: { joker: true },
      method: 'GET',
      params: { hi: 1 },
    },
  ])(
    'should make a successful http request when args is %p',
    async (args) => {
      const baseUrl = 'http://test.com';
      const expectedResult = { data: generateRandomString() };
      mockedAxios.request.mockResolvedValue(expectedResult);
      const query = axiosBaseQuery({
        baseUrl,
        withCredentials: false,
      });

      const result = await query(args, api, extraOptions);

      expect(mockedAxios.request).toHaveBeenCalledWith({
        url: args.url,
        data: args.body,
        baseURL: baseUrl,
        params: args.params,
        method: args.method,
        withCredentials: false,
      });
      expect(result).toStrictEqual(expectedResult);
    },
  );

  it('should use response.data as error message on failed request', async () => {
    mockedAxios.request.mockRejectedValue({
      response: {
        status: 500,
        data: 'Server error',
      },
    });
    const query = axiosBaseQuery({
      baseUrl: '',
      withCredentials: false,
    });

    const result = await query('/test', api, extraOptions);

    expect(result.error).toStrictEqual({
      status: 500,
      data: {
        message: 'Server error',
        path: undefined,
        timestamp: undefined,
      },
    });
  });

  it('should use axios error message when response.data is undefined on failed request', async () => {
    mockedAxios.request.mockRejectedValue({
      response: {
        status: 503,
      },
      message: 'axios error message',
    });
    const query = axiosBaseQuery({
      baseUrl: '',
      withCredentials: false,
    });

    const result = await query('/test', api, extraOptions);

    expect(result.error).toStrictEqual({
      status: 503,
      data: {
        message: 'axios error message',
        path: undefined,
        timestamp: undefined,
      },
    });
  });
});
