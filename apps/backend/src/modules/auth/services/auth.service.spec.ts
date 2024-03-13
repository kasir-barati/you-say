import FusionAuthClient from '@fusionauth/typescript-client';
import { SinonMock } from '../../../shared/helpers/sinon-mock.helper';
import { MockedEntityWithSinonStubs } from '../../../shared/types/mock.type';
import {
  FusionAuthClientConfig,
  FusionAuthUserGroup,
} from '../auth.type';
import { AuthService } from './auth.service';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';

describe('AuthService', () => {
  let authService: AuthService;
  let fusionAuthClient: MockedEntityWithSinonStubs<FusionAuthClient>;

  beforeEach(() => {
    const fusionAuthErrorSerializer = new FusionAuthErrorSerializer();
    const fusionAuthConfigs = {
      FUSIONAUTH_APPLICATION_ID: 'uuid',
      FUSIONAUTH_ADMIN_GROUP_ID: 'uuid',
    } as FusionAuthClientConfig;
    fusionAuthClient =
      SinonMock.of<FusionAuthClient>(FusionAuthClient);
    authService = new AuthService(
      fusionAuthConfigs,
      fusionAuthClient,
      fusionAuthErrorSerializer,
    );
  });

  it.each<
    { userId: string } & Parameters<typeof authService.register>[0]
  >([
    {
      groups: [],
      userId: 'uuid1',
      email: 'test@te.js',
    },
    {
      groups: [],
      userId: 'uuid1',
      email: 'test@te.js',
      firstName: 'test',
      lastName: 'test',
    },
    {
      userId: 'uuid2',
      email: 'temp@te.com',
      groups: [FusionAuthUserGroup.Admin],
    },
  ])(
    'should return $userId this.fusionAuthClient.register when I call register',
    async ({ email, groups, userId, firstName, lastName }) => {
      fusionAuthClient.register.resolves({
        response: { user: { id: userId } },
      });

      const result = await authService.register({
        email,
        firstName,
        lastName,
        groups,
      });

      expect(result).toBe(userId);
    },
  );

  it.each<{ response: { user?: { id?: string } } }>([
    { response: {} },
    { response: { user: {} } },
  ])(
    'should throw an error when user or user.id does not exist in the response',
    async (mockedResponse) => {
      fusionAuthClient.register.resolves(mockedResponse);

      const result = authService.register({
        email: 't@t.com',
        groups: [],
      });

      await expect(result).rejects.toThrow();
    },
  );

  it('should throw an error when fusionAuthClient.register throws an error', async () => {
    fusionAuthClient.register.rejects();

    const result = authService.register({
      email: 't@t.com',
      groups: [],
    });

    await expect(result).rejects.toThrow();
  });
});
