import { createApi } from '@reduxjs/toolkit/query/react';
import { RegisterRequestBody, RegisterResponse } from '@shared';
import { createBaseQuery } from './create-base-query.api';

const baseQuery = createBaseQuery(
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
);
const reducerPath = 'authApi';

export const authApi = createApi({
  baseQuery,
  reducerPath,
  endpoints(build) {
    return {
      signUp: build.mutation<RegisterResponse, RegisterRequestBody>({
        query(body) {
          return {
            url: 'auth/register',
            method: 'POST',
            body,
          };
        },
      }),
    };
  },
});
export const { useSignUpMutation } = authApi;
