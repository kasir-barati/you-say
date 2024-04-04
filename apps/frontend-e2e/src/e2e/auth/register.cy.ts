import { generateRandomString } from '@shared';
import {
  clickOnDoNotHaveAnAccountButton,
  clickOnSignInButtonInHeader,
  clickOnSignUpButton,
  fillEmailInput,
  fillFirstNameInput,
  fillLastNameInput,
  verifySuccessfulSignUpNotificationMessage,
} from '../../support/app.header';

describe('auth => register', () => {
  beforeEach(() => cy.visit('/'));

  it(`should display "You're now one of our users!" notification after successful registration.`, () => {
    const randomEmail = generateRandomString(21) + '@gmail.com';

    clickOnSignInButtonInHeader();
    clickOnDoNotHaveAnAccountButton();
    fillFirstNameInput(generateRandomString(21));
    fillLastNameInput(generateRandomString(21));
    fillEmailInput(randomEmail);
    clickOnSignUpButton();
    verifySuccessfulSignUpNotificationMessage();
  });
});
