import { verifyLogoNameInHeader } from '../support/app.header';

describe('app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display "you-say" in the header', () => {
    verifyLogoNameInHeader();
  });
});
