import { getTempUser } from '@shared';
import { user as userInFusionAuth } from '../../support/fusionauth';
import { user, verify } from '../../support/index-page';

describe('auth => register', () => {
  beforeEach(() => cy.visit('/'));

  it('should login the default temp user', () => {
    const tempUser = getTempUser();

    user.clickOnSignInButtonInHeader();
    user.clickOnSignInButton();
    userInFusionAuth.fillLoginIdInput(tempUser.email);
    userInFusionAuth.fillPasswordInput(tempUser.password);
    userInFusionAuth.clickOnSubmitButton();
    verify.successfulSignIn();
  });

  it(`should show a link to sign up form.`, () => {
    user.clickOnSignInButtonInHeader();
    user.clickOnDoNotHaveAnAccountButton();
    verify.signUpFormExists();
  });
});
