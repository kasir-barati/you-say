import { ApiProperty } from '@nestjs/swagger';
import { CreateNewsletterSubscription } from '@shared';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class CreateNewsletterSubscriptionDto
  implements CreateNewsletterSubscription
{
  @ApiProperty({
    example: 'email@example.com',
    description: 'Email address',
  })
  @Transform(({ value }) => value?.trim?.())
  @IsEmail()
  email: string;
}
