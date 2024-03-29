import {
  SearchResponse,
  UserDeleteRequest,
} from '@fusionauth/typescript-client';
import { wait } from '@shared';
import axios from 'axios';
import { stringify } from 'querystring';
import './env-loader.util';

const FUSIONAUTH_HOST = 'http://localhost:9011';
const { FUSIONAUTH_TENANT_ID, FUSIONAUTH_API_KEY } = process.env;
const defaultUsersEmails = ['admin@you-say.com', 'admin@admin.com'];

export async function cleanupFusionAuth() {
  await wait(500);
  await removeUsersExceptDefaultOnes();
  await resetMembershipsOfDefaultUsers();
}

async function removeUsersExceptDefaultOnes() {
  const {
    data: { users },
  } = await axios.get<SearchResponse>(
    `${FUSIONAUTH_HOST}/api/user/search`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': FUSIONAUTH_API_KEY,
        'X-FusionAuth-TenantId': FUSIONAUTH_TENANT_ID,
      },
      params: {
        queryString: '@',
        numberOfResults: 1000,
      },
    },
  );
  const userIds = users
    .filter((user) => !defaultUsersEmails.includes(user.email))
    .map((user) => user.id);

  if (userIds.length <= 0) {
    console.info('No users found to delete');
    return;
  }

  await axios.delete<UserDeleteRequest>(
    `${FUSIONAUTH_HOST}/api/user/bulk`,
    {
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
    },
  );
}

async function resetMembershipsOfDefaultUsers() {
  const {
    data: { users },
  } = await axios.get<SearchResponse>(
    `${FUSIONAUTH_HOST}/api/user/search`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': FUSIONAUTH_API_KEY,
        'X-FusionAuth-TenantId': FUSIONAUTH_TENANT_ID,
      },
      params: {
        queryString: '@',
        numberOfResults: 1000,
      },
    },
  );
  const userIds = users
    .filter((user) => defaultUsersEmails.includes(user.email))
    .map((user) => user.id);
  const promises = userIds.map((userId) =>
    axios.patch(
      `${FUSIONAUTH_HOST}/api/user/${userId}`,
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
    ),
  );

  await Promise.all(promises);
}
