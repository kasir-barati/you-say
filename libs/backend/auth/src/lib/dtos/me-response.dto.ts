import { ApiProperty } from '@nestjs/swagger';
import { MeResponse, Role } from '@shared';

export class MeResponseDto implements MeResponse {
  @ApiProperty({
    example: 'uuid',
    description:
      'The unique Id of the Application for which the User has been authenticated.',
  })
  applicationId: string;

  @ApiProperty({
    example: 'example@ex.com',
    description:
      'The email address of the User whose claims are represented by this JWT.',
  })
  email: string;

  @ApiProperty({
    example: true,
    description:
      "The OpenId Connect claim indicating if the User's email has been verified.",
  })
  email_verified: boolean;

  @ApiProperty({
    example: 'Kazuya',
    description: "User's family if available.",
  })
  family_name: string;

  @ApiProperty({
    example: 'Souma',
    description: "User's name if available.",
  })
  given_name: string;

  @ApiProperty({
    example: 'souma.kazuya@you-say.com',
    description:
      "We've configured our OAuth server to use user's email address as their preferred username.",
  })
  preferred_username: string;

  @ApiProperty({
    example: [],
    description:
      'The roles assigned to the User in the authenticated Application. This claim is only present if the User has a registration to the Application.',
  })
  roles: Role[];

  @ApiProperty({
    example: 'openid offline_access',
    description: 'Scopes of OAuth server',
  })
  scope: string;

  @ApiProperty({
    example: {},
    description: "User's settings",
  })
  settings: unknown;

  @ApiProperty({
    example: '659b75da-69f9-471f-813d-62c8baff1f86',
    description:
      'The unique Id of the refresh token returned along with this access token when the offline_access scope was requested. This unique Id is the persistent identifier for this refresh token, and will not change even when using one-time use refresh tokens. This value may optionally be used to revoke the token using the Refresh Token API.',
  })
  sid: string;

  @ApiProperty({
    example: '7b176652-c80f-47a4-9533-6e80ddc4f355',
    description:
      "The subject of the access token. This value is equal to the User's ID in OAuth server.",
  })
  sub: string;

  @ApiProperty({
    example: {},
    description: "Tenant's info",
  })
  tenant: unknown;

  @ApiProperty({
    example: '16fc8438-3ec0-466d-89dc-92c35db746a4',
    description: 'The FusionAuth Tenant unique Id.',
  })
  tid: string;
}
