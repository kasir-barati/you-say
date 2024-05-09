import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { ErrorResponse } from '@shared';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { logger } from '../utils/logger.util';

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
      const axiosError = error as AxiosError<ErrorResponse>;
      const status = axiosError.response?.status;
      const data = genData(axiosError);

      logger.log(axiosError);

      return {
        error: {
          status,
          data,
        },
      };
    }
  };
}

function genData(error: AxiosError<ErrorResponse>) {
  const data: Partial<ErrorResponse> = {
    path: error.response?.data?.path,
    timestamp: error.response?.data?.timestamp,
  };

  if (!error?.response?.data && error.message) {
    data.message = error.message;

    return data;
  }

  if (isHtml(error.response)) {
    data.message = error.message;

    return data;
  }

  if (typeof error.response?.data === 'string') {
    data.message = error.response.data;

    return data;
  }

  return error.response?.data;
}

/**
 * @description tldr; both HTTP/1.1 and HTTP/2 header names are case-insensitive BUT HTTP/2 enforces lowercase header names ([ref](https://stackoverflow.com/a/41169947/8784518)). That's why here we are not checking or normalizing the header names.
 */
function isHtml(errorResponse: AxiosError['response']) {
  const contentType = errorResponse?.headers?.['content-type'];

  if (
    typeof errorResponse?.data === 'string' &&
    contentType?.toLowerCase()?.includes('text/html')
  ) {
    return true;
  }
  return false;
}
