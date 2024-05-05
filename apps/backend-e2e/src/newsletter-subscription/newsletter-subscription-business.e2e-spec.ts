import {
  CreateNewsletterSubscription,
  generateRandomString,
} from '@shared';
import { NewsletterSubscriptionApi } from '../api-client';

describe('Newsletter Subscription -- Validation', () => {
  const newsletterSubscriptionApi: NewsletterSubscriptionApi =
    new NewsletterSubscriptionApi();

  describe('POST /newsletter-subscription', () => {
    it.each<CreateNewsletterSubscription>([
      { email: `e${generateRandomString()}@example.com` },
    ])(
      'should subscribe: %o',
      async (createNewsletterSubscriptionDto) => {
        const { status } =
          await newsletterSubscriptionApi.newsletterSubscriptionControllerCreate(
            { createNewsletterSubscriptionDto },
          );

        expect(status).toEqual(201);
      },
    );
  });
});
