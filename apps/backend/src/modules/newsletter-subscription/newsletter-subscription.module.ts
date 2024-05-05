import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NewsletterSubscription,
  NewsletterSubscriptionSchema,
} from './entities/newsletter-subscription.entity';
import { NewsletterSubscriptionController } from './newsletter-subscription.controller';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: NewsletterSubscription.name,
        schema: NewsletterSubscriptionSchema,
      },
    ]),
  ],
  controllers: [NewsletterSubscriptionController],
  providers: [NewsletterSubscriptionService],
})
export class NewsletterSubscriptionModule {}
