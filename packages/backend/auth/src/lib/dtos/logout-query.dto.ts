import { IsUrl } from '@backend/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class LogoutQueryDto {
  @ApiProperty({
    name: 'post_logout_redirect_uri',
    description: '',
  })
  @Expose({ name: 'post_logout_redirect_uri' })
  @IsUrl()
  postLogoutRedirectUrl: string;

  @ApiProperty({
    name: 'client_id',
    required: false,
    description:
      'The unique client identifier. The client Id is the Id of the FusionAuth Application in which you are requesting to logout, this value is used to identify the correct redirect URI. Generally speaking this parameter is required, but it becomes redundant because the application can be identified based on the `id_token` in cookies.',
  })
  @Expose({ name: 'client_id' })
  @IsOptional()
  @IsUUID()
  clientId?: string;
}
