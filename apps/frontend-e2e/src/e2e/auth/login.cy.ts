import { generateRandomString, getTempUser } from '@shared';
import {
  clickOnDoNotHaveAnAccountButton,
  clickOnSignInButton,
  clickOnSignInButtonInHeader,
  clickOnSignUpButton,
  fillEmailInput,
  fillFirstNameInput,
  fillLastNameInput,
  verifySuccessfulSignIn,
  verifySuccessfulSignUpNotificationMessage,
} from '../../support/app.header';
import {
  clickOnSubmitButton,
  fillLoginIdInput,
  fillPasswordInput,
} from '../../support/fusionauth';

describe('auth => register', () => {
  beforeEach(() => cy.visit('/'));

  it('should login the default temp user', () => {
    const user = getTempUser();

    clickOnSignInButtonInHeader();
    clickOnSignInButton();
    fillLoginIdInput(user.email);
    fillPasswordInput(user.password);
    clickOnSubmitButton();
    verifySuccessfulSignIn();
  });

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
