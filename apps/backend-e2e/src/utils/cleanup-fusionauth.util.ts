import {
  SearchResponse,
  UserDeleteRequest,
} from '@fusionauth/typescript-client';
import { wait } from '@shared';
import axios from 'axios';
import { stringify } from 'querystring';
import {
  FUSIONAUTH_API_KEY,
  FUSIONAUTH_HOST,
  FUSIONAUTH_TENANT_ID,
} from './env-variables.util';

const defaultUsersEmails = [
  'admin@you-say.com',
  'admin@admin.com',
  'souma.kazuya@you-say.com',
];
const searchForUsersUrl = new URL(
  'api/user/search',
  FUSIONAUTH_HOST,
).toString();

export async function cleanupFusionAuth() {
  await wait(500);
  await removeUsersExceptDefaultOnes();
  await resetMembershipsOfDefaultUsers();
}

async function removeUsersExceptDefaultOnes() {
  const deactivateUsersUrl = new URL(
    '/api/user/bulk',
    FUSIONAUTH_HOST,
  ).toString();

  const {
    data: { users },
  } = await axios.get<SearchResponse>(searchForUsersUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': FUSIONAUTH_API_KEY,
      'X-FusionAuth-TenantId': FUSIONAUTH_TENANT_ID,
    },
    params: {
      queryString: '@',
      numberOfResults: 1000,
    },
  });
  const userIds = users
    .filter((user) => !defaultUsersEmails.includes(user.email))
    .map((user) => user.id);

  if (userIds.length <= 0) {
    console.info('No users found to delete');
    return;
  }

  await axios.delete<UserDeleteRequest>(deactivateUsersUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': FUSIONAUTH_API_KEY,
      'X-FusionAuth-TenantId': FUSIONAUTH_TENANT_ID,
    },
    paramsSerializer(params) {
      return stringify(params);
    },
    params: {
      userId: userIds,
      hardDelete: true,
    },
  });
}

async function resetMembershipsOfDefaultUsers() {
  const {
    data: { users },
  } = await axios.get<SearchResponse>(searchForUsersUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': FUSIONAUTH_API_KEY,
      'X-FusionAuth-TenantId': FUSIONAUTH_TENANT_ID,
    },
    params: {
      queryString: '@',
      numberOfResults: 1000,
    },
  });
  const userIds = users
    .filter((user) => defaultUsersEmails.includes(user.email))
    .map((user) => user.id);
  const promises = userIds.map((userId) => {
    const updateTheUserUrl = new URL(
      `api/user/${userId}`,
      FUSIONAUTH_HOST,
    ).toString();

    return axios.patch(
      updateTheUserUrl,
      {
        user: { data: {} },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': FUSIONAUTH_API_KEY,
          'X-FusionAuth-TenantId': FUSIONAUTH_TENANT_ID,
        },
      },
    );
  });

  await Promise.all(promises);
}
