import { IsUrl } from '@backend/common';
import { ApiProperty } from '@nestjs/swagger';
import { LoginRequestQuery } from '@shared';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class LoginQueryDto implements LoginRequestQuery {
  @ApiProperty({
    name: 'client_id',
    example: '60e15803-1857-400d-8167-968573834454',
    description:
      'Client ID is sent from the client side application to have more flexibility in backend.',
  })
  @Expose({ name: 'client_id' })
  @Transform(({ value }) => value?.trim?.())
  @IsUUID()
  clientId: string;

  @ApiProperty({
    name: 'redirect_uri',
    example: 'http://localhost:3000/',
    description:
      'We are also getting the redirect url from the client side application so that if we had different frontend application we know to which one to redirect after completion of login process.',
  })
  @Expose({ name: 'redirect_uri' })
  @Transform(({ value }) => value?.trim?.())
  @IsUrl()
  redirectUrl: string;

  @ApiProperty({
    example: '/posts',
    description:
      "The `login` and `register` functions both accept an optional string parameter called state. We'll use it to indicate which page the user was on before redirecting to login or registration, so that the user can be returned to that location after a successful authentication ([ref](https://www.npmjs.com/package/@fusionauth/react-sdk#state-parameter)).",
  })
  @Transform(({ value }) => value?.trim?.())
  @IsString()
  @IsNotEmpty()
  state: string;
}
