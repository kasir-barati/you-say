import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class OauthCallbackCookie {
  @ApiProperty({
    description:
      "This is the state that we generated when user started OAuth process by calling login endpoint. Note: this cookie's key is oauth_state and we just utilized class-transformer to expose it as oauthState for convenient reasons.",
  })
  @Transform(({ value }) => value?.trim?.())
  @Expose({ name: 'oauth_state' })
  @IsNotEmpty()
  @IsString()
  oauthState: string;

  @ApiProperty({
    description:
      "This is the nonce we generated when user called login endpoint. Note: this cookie's key is oauth_none and we just utilized class-transformer to expose it as oauthNonce for convenient reasons.",
  })
  @Transform(({ value }) => value?.trim?.())
  @Expose({ name: 'oauth_nonce' })
  @IsNotEmpty()
  @IsString()
  oauthNonce: string;

  @ApiProperty({
    description:
      "This is also what we generated and attached it to the response cookies in login endpoint. Note: this cookie's key is oauth_code_verifier and we just utilized class-transformer to expose it as oauthCodeVerifier for convenient reasons.",
  })
  @Transform(({ value }) => value?.trim?.())
  @Expose({ name: 'oauth_code_verifier' })
  @IsNotEmpty()
  @IsString()
  oauthCodeVerifier: string;
}
