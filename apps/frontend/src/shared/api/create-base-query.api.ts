import { Mutex } from 'async-mutex';
import axios from 'axios';
import {
  AxiosBaseQueryError,
  axiosBaseQuery,
} from './axios-base-query.api';

const mutex = new Mutex();

export function createBaseQuery(
  backendUrl: string,
): ReturnType<typeof axiosBaseQuery> {
  // const {logout} = useFusionAuth(); // TODO: can I do this?
  const baseQuery = axiosBaseQuery({
    baseUrl: backendUrl,
    // Request won't fails soly due to absence of credentials, rather server will throw an error at us if it needed the credentials.
    withCredentials: true,
  });
  const baseQueryWithReauth: typeof baseQuery = async (
    args,
    api,
    extraOption,
  ) => {
    // Waiting for the mutex availability without locking it. Mostly API requests will run in parallel since no one has locked the mutex.
    await mutex.waitForUnlock();
    const result = await baseQuery(args, api, extraOption);
    const isAuthError = isForbiddenOrUnauthorized(result.error);

    if (isAuthError && mutex.isLocked()) {
      await mutex.waitForUnlock();
      return baseQuery(args, api, extraOption);
    }

    if (isAuthError) {
      const mutexReleaser = await mutex.acquire();

      try {
        const { status } = await axios.get('auth/refresh', {
          withCredentials: true,
          baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
        });

        if (status !== 200) {
          throw 'Was not able to get new JWT token!';
        }

        return await baseQuery(args, api, extraOption);
      } catch (error) {
        // logout()
      } finally {
        mutexReleaser();
        // TODO: should not we return undefined or throw an error in case we have dispatched an signOut and our refreshing failed?
      }
    }

    return result;
  };

  return baseQueryWithReauth;
}

function isForbiddenOrUnauthorized(error?: AxiosBaseQueryError) {
  return error?.status && [401, 403].includes(error.status);
}
