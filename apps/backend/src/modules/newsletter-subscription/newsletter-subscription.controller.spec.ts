import { SinonMock, SinonMockType } from '@shared';
import { NewsletterSubscriptionController } from './newsletter-subscription.controller';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';

describe('NewsletterSubscriptionController', () => {
  let controller: NewsletterSubscriptionController;
  let newsletterSubscriptionService: SinonMockType<NewsletterSubscriptionService>;

  beforeEach(() => {
    newsletterSubscriptionService = SinonMock.of(
      NewsletterSubscriptionService,
    );
    controller = new NewsletterSubscriptionController(
      newsletterSubscriptionService,
    );
  });

  describe('POST /newsletter-subscription', () => {
    it('should subscribe', () => {
      const email = 'email@example.com';
      newsletterSubscriptionService.create
        .withArgs({ email })
        .resolves();

      const result = controller.create({
        email,
      });

      expect(result).resolves.not.toThrow();
    });

    it('should propagate thrown error in service', () => {
      const email = 'email@example.com';
      newsletterSubscriptionService.create
        .withArgs({ email })
        .rejects(new Error());

      const result = controller.create({
        email,
      });

      expect(result).rejects.toThrow(Error);
    });
  });
});
