import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNewsletterSubscriptionDto } from './dto/subscribe.dto';
import { NewsletterSubscription } from './entities/newsletter-subscription.entity';

@Injectable()
export class NewsletterSubscriptionService {
  constructor(
    @InjectModel(NewsletterSubscription.name)
    private readonly newsletterSubscriptionModel: Model<NewsletterSubscription>,
  ) {}

  async create(
    createNewsletterSubscriptionDto: CreateNewsletterSubscriptionDto,
  ): Promise<void> {
    await this.newsletterSubscriptionModel.create({
      email: createNewsletterSubscriptionDto.email,
    });
  }
}
