import { SHARED_SELECTORS } from './shared-selectors';

const SELECTORS = {
  appHeader: 'header',
  singInButtonInHeader: 'sign-in-button-in-header',
  doNotHaveAnAccountButton: 'do-not-have-an-account-button',
  signInButton: 'sign-in-button',
  singUpFirstNameInput: 'sign-up-first-name-input',
  signUpLastNameInput: 'sign-up-last-name-input',
  signUpEmailInput: 'sign-up-email-input',
  signUpButton: 'sign-up-button',
  notFoundTitle: '404-title',
  notFoundMessage: '404-message',
  notFoundLink: '404-link',
};

export function verifyLogoNameInHeader() {
  cy.getByTestId(SELECTORS.appHeader)
    .should('exist')
    .should('contain', 'you-say');
}
export function verifyNonExistentPage() {
  cy.getByTestId(SELECTORS.notFoundTitle).should('contain', '404');
  cy.getByTestId(SELECTORS.notFoundMessage).should(
    'contain',
    'Page not found',
  );
  cy.getByTestId(SELECTORS.notFoundLink)
    .should('contain', 'Go to the front page →')
    .should('have.attr', 'href', '/');
}
export function clickOnSignInButtonInHeader() {
  cy.getByTestId(SELECTORS.appHeader)
    .getByTestId(SELECTORS.singInButtonInHeader)
    .click();
}
export function clickOnDoNotHaveAnAccountButton() {
  cy.getByTestId(SELECTORS.doNotHaveAnAccountButton).click();
}
export function fillFirstNameInput(value: string) {
  cy.getByTestId(SELECTORS.singUpFirstNameInput).type(value);
}
export function fillLastNameInput(value: string) {
  cy.getByTestId(SELECTORS.signUpLastNameInput).type(value);
}
export function fillEmailInput(value: string) {
  cy.getByTestId(SELECTORS.signUpEmailInput).type(value);
}
export function clickOnSignUpButton() {
  cy.getByTestId(SELECTORS.signUpButton).click();
}
export function verifySuccessfulSignUpNotificationMessage() {
  cy.getByTestId(
    SHARED_SELECTORS.notificationMessageParagraph,
  ).should('have.text', "You're now one of our users!");
}
export function clickOnSignInButton() {
  cy.getByTestId(SELECTORS.signInButton).click();
}
export function verifySuccessfulSignIn() {
  console.log(Cypress.env('FRONTEND_URL'));

  // TODO: show a notification saying "We've logged you in!"
  cy.url().should('include', Cypress.env('FRONTEND_URL'));
}
