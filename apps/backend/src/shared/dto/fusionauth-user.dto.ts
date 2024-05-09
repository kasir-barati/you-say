import { ApiProperty } from '@nestjs/swagger';
import { FusionAuthUser } from '@shared';

export class FusionAuthUserDto implements FusionAuthUser {
  @ApiProperty({
    description: 'User ID in FusionAuth',
    example: '3b467620-8dd3-48d1-a403-e4117f16ff41',
  })
  fusionAuthId: string;

  @ApiProperty({
    description: 'First name',
    example: 'Katarina',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Santana',
  })
  lastName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'katarina.santana@bit.com',
  })
  email: string;
}
