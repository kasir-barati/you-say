import { generateRandomString } from '@shared';
import {
  verifyLogoNameInHeader,
  verifyNonExistentPage,
} from '../support/app.header';

describe('app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display "you-say" in the header', () => {
    verifyLogoNameInHeader();
  });

  it('should show 404 page when visiting a nonexistent page', () => {
    cy.visit(`/${generateRandomString()}`, {
      failOnStatusCode: false,
    });
    verifyNonExistentPage();
  });
});
