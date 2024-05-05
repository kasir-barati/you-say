import { generateRandomString } from '@shared';
import { user, verify } from '../support/index-page';

describe('app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display "you-say" in the header', () => {
    verify.logo();
  });

  it('should subscribe user for newsletter', () => {
    const email = 'e' + generateRandomString() + '@gmail.com';

    user.fillSubscriptionInput(email);
    user.clickOnSubscribe();
    verify.successfulSubscription();
  });

  it('should show 404 page when visiting a nonexistent page', () => {
    cy.visit(`/${generateRandomString()}`, {
      failOnStatusCode: false,
    });
    verify.notFoundPage();
  });
});
