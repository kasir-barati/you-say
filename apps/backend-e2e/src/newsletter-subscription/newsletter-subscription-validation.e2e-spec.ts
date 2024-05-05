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
      'should pass the validation layer: %o',
      async (createNewsletterSubscriptionDto) => {
        const { status } =
          await newsletterSubscriptionApi.newsletterSubscriptionControllerCreate(
            { createNewsletterSubscriptionDto },
            {
              validateStatus(status) {
                return status > 200;
              },
            },
          );

        expect(status).toEqual(201);
      },
    );

    it.each<CreateNewsletterSubscription>([
      { email: generateRandomString() },
    ])(
      'should not pass the validation layer: %o',
      async (createNewsletterSubscriptionDto) => {
        const { status } =
          await newsletterSubscriptionApi.newsletterSubscriptionControllerCreate(
            { createNewsletterSubscriptionDto },
            {
              validateStatus(status) {
                return status > 200;
              },
            },
          );

        expect(status).toEqual(400);
      },
    );
  });
});
