import FusionAuthClient, {
  GroupMember,
} from '@fusionauth/typescript-client';
import { Inject, Injectable } from '@nestjs/common';
import {
  AUTH_MODULE_FUSIONAUTH_CLIENT,
  AUTH_MODULE_OPTIONS,
} from '../auth.constants';
import {
  AuthModuleOptions,
  FusionAuthUserGroup,
} from '../types/auth.type';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly fusionAuthConfigs: AuthModuleOptions,
    @Inject(AUTH_MODULE_FUSIONAUTH_CLIENT)
    private readonly fusionAuthClient: FusionAuthClient,
    private readonly fusionAuthErrorSerializer: FusionAuthErrorSerializer,
  ) {}

  async register({
    email,
    groups,
    lastName,
    firstName,
  }: {
    email: string;
    lastName?: string;
    firstName?: string;
    groups: FusionAuthUserGroup[];
  }): Promise<string> | never {
    const applicationId =
      this.fusionAuthConfigs.fusionAuthApplicationId;
    const memberships = this.getMemberships(groups);
    try {
      // Passing an empty string as userId signifies that FusionAuth should create it automatically.
      const { response } = await this.fusionAuthClient.register('', {
        sendSetPasswordEmail: true,
        registration: {
          applicationId,
        },
        user: {
          email,
          lastName,
          firstName,
          memberships,
          fullName: `${firstName} ${lastName}`,
          data: {
            // Here we can save meta data, or settings and other info
          },
        },
      });

      if (!response?.user || !response?.user?.id) {
        throw `[Unexpected-a3abc897fd] we do not have access to ${
          response.user ? 'user id' : 'user'
        }`;
      }
      await this.fusionAuthClient.refreshUserSearchIndex();

      return response.user.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.fusionAuthErrorSerializer.duplicateEmail(error, email);
      this.fusionAuthErrorSerializer.fusionAuthError(error);
    }
  }

  private getMemberships(
    groups: FusionAuthUserGroup[],
  ): GroupMember[] {
    const memberships: GroupMember[] = [];

    if (groups.includes(FusionAuthUserGroup.Admin)) {
      memberships.push({
        groupId: this.fusionAuthConfigs.fusionAuthAdminGroupId,
      });
    }

    return memberships;
  }
}
