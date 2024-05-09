import { createApi } from '@reduxjs/toolkit/query/react';
import { FindAllPostsQuery, FindAllPostsResponse } from '@shared';
import { createBaseQuery } from './create-base-query.api';

const baseQuery = createBaseQuery(
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
);
const reducerPath = 'postApi';
const tagTypes: string[] = [];

export const postApi = createApi({
  baseQuery,
  reducerPath,
  tagTypes: tagTypes,
  endpoints(build) {
    return {
      findAll: build.mutation<
        FindAllPostsResponse,
        FindAllPostsQuery
      >({
        query(queries) {
          return {
            url: 'posts',
            method: 'GET',
            params: queries,
          };
        },
      }),
    };
  },
});
export const { useFindAllMutation } = postApi;
