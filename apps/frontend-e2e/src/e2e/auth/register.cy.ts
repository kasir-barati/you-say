import { generateRandomString } from '@shared';
import { user, verify } from '../../support/index-page';

describe('auth => register', () => {
  beforeEach(() => cy.visit('/'));

  it(`should display "Signed up successfully, Now check your email!" notification after successful registration.`, () => {
    const randomEmail =
      'test-' + generateRandomString(21) + '@gmail.com';

    user.clickOnSignUpButtonInHeader();
    user.fillFirstNameInput(generateRandomString(21));
    user.fillLastNameInput(generateRandomString(21));
    user.fillEmailInput(randomEmail);
    user.clickOnSignUpButton();
    verify.successfulSignUp();
  });
});
