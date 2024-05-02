import { generateRandomString } from '@shared';
import { verify } from '../support/app.header';

describe('app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display "you-say" in the header', () => {
    verify.logo();
  });

  it('should show 404 page when visiting a nonexistent page', () => {
    cy.visit(`/${generateRandomString()}`, {
      failOnStatusCode: false,
    });
    verify.notFoundPage();
  });
});
