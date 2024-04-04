import { SHARED_SELECTORS } from './shared-selectors';

const SELECTORS = {
  appHeader: 'header[data-test=header]',
  singInButtonInHeader: 'button[data-test=sign-in-button-in-header]',
  doNotHaveAnAccountButton:
    'button[data-test=do-not-have-an-account-button]',
  singUpFirstNameInput: 'input[data-test=sign-up-first-name-input]',
  signUpLastNameInput: 'input[data-test=sign-up-last-name-input]',
  signUpEmailInput: 'input[data-test=sign-up-email-input]',
  signUpButton: 'button[data-test=sign-up-button]',
};

export function verifyLogoNameInHeader() {
  cy.get(SELECTORS.appHeader)
    .should('exist')
    .should('contain', 'you-say');
}
export function clickOnSignInButtonInHeader() {
  cy.get(SELECTORS.appHeader)
    .get(SELECTORS.singInButtonInHeader)
    .click();
}
export function clickOnDoNotHaveAnAccountButton() {
  cy.get(SELECTORS.doNotHaveAnAccountButton).click();
}
export function fillFirstNameInput(value: string) {
  cy.get(SELECTORS.singUpFirstNameInput).type(value);
}
export function fillLastNameInput(value: string) {
  cy.get(SELECTORS.signUpLastNameInput).type(value);
}
export function fillEmailInput(value: string) {
  cy.get(SELECTORS.signUpEmailInput).type(value);
}
export function clickOnSignUpButton() {
  cy.get(SELECTORS.signUpButton).click();
}
export function verifySuccessfulSignUpNotificationMessage() {
  cy.get(SHARED_SELECTORS.notificationMessageParagraph).should(
    'have.text',
    "You're now one of our users!",
  );
}
