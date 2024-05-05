import { ErrorResponseDto } from '@backend/common';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNewsletterSubscriptionDto } from './dto/subscribe.dto';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';

@ApiTags('Newsletter Subscription')
@Controller('newsletter-subscription')
export class NewsletterSubscriptionController {
  constructor(
    private readonly newsletterSubscriptionService: NewsletterSubscriptionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Add a new subscriber to newsletter.',
  })
  @ApiCreatedResponse({
    description:
      'Returns nothing. You can use http status code to realize whether the operation was failed or completed.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Bad request; e.g. email address is not valid!',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal Server Error',
  })
  create(
    @Body()
    createNewsletterSubscriptionDto: CreateNewsletterSubscriptionDto,
  ): Promise<void> {
    return this.newsletterSubscriptionService.create(
      createNewsletterSubscriptionDto,
    );
  }
}
