import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';

interface AxiosBaseQuery {
  baseUrl: string;
  withCredentials: boolean;
}
export interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  body?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
}

export interface AxiosBaseQueryError {
  status: number | undefined;
  data: unknown | string;
}
export function axiosBaseQuery({
  baseUrl,
  withCredentials,
}: AxiosBaseQuery): BaseQueryFn<
  AxiosBaseQueryArgs | string,
  unknown,
  AxiosBaseQueryError
> {
  return async (args) => {
    const {
      url,
      method = 'GET' as const,
      params = undefined,
      body = undefined,
    } = typeof args === 'string' ? { url: args } : args;

    try {
      const { data } = await axios.request({
        url,
        method,
        params,
        data: body,
        withCredentials,
        baseURL: baseUrl,
      });

      return { data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };
}
