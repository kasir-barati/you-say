import { createApi } from '@reduxjs/toolkit/query/react';
import { CreateNewsletterSubscription } from '@shared';
import { createBaseQuery } from './create-base-query.api';

const baseQuery = createBaseQuery(
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
);
const reducerPath = 'newsletterSubscription';
const tagTypes: string[] = [];

export const newsletterSubscription = createApi({
  baseQuery,
  reducerPath,
  tagTypes: tagTypes,
  endpoints(build) {
    return {
      subscribeToNewsletter: build.mutation<
        void,
        CreateNewsletterSubscription
      >({
        query(body) {
          return {
            url: 'newsletter-subscription',
            method: 'POST',
            body,
          };
        },
      }),
    };
  },
});
export const { useSubscribeToNewsletterMutation } =
  newsletterSubscription;
