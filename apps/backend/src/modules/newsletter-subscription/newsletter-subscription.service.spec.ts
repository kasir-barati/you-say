import { SinonMock, SinonMockType } from '@shared';
import { Model } from 'mongoose';
import { NewsletterSubscription } from './entities/newsletter-subscription.entity';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';

describe('NewsletterSubscriptionService', () => {
  let service: NewsletterSubscriptionService;
  let newsletterSubscriptionModel: SinonMockType<
    Model<NewsletterSubscription>
  >;

  beforeEach(() => {
    newsletterSubscriptionModel = SinonMock.with<
      Model<NewsletterSubscription>
    >({});
    service = new NewsletterSubscriptionService(
      newsletterSubscriptionModel,
    );
  });

  describe('create', () => {
    it('should create newsletter subscription', () => {
      const email = 'bao.chen@example.com';
      newsletterSubscriptionModel.create
        .withArgs({ email })
        .resolves();

      const result = service.create({ email });

      expect(result).resolves.not.toThrow();
    });

    it('should propagate errors occurred in model', () => {
      const email = 'bao.chen@example.com';
      newsletterSubscriptionModel.create
        .withArgs({ email })
        .rejects(new Error());

      const result = service.create({ email });

      expect(result).rejects.toThrow(Error);
    });
  });
});
