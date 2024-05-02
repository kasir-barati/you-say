import { SHARED_SELECTORS } from './shared-selectors';

const SELECTORS = {
  logo: '[aria-label="Logo"]',
  singInButtonInHeader: 'button[aria-label="Sign in"]',
  singUpButtonInHeader: 'button[aria-label="Sign up"]',
  doNotHaveAnAccountButton: 'button[aria-label="Create one!"]',
  signInButton: 'button[aria-label="Continue signing in..."]',
  singUpFirstNameInput: 'input[placeholder="Name"]',
  signUpLastNameInput: 'input[placeholder="Family"]',
  signUpEmailInput: 'input[placeholder="email@example.com"]',
  signUpButtonInSignUpForm: 'sign-up-button-in-sign-up-form',
  notFoundTitle: '[aria-label="404"]',
  notFoundMessage: '[aria-label="Page not found"]',
  notFoundLink: '[aria-label="Go to the front page"]',
};

// #region User interactions
function clickOnSignInButtonInHeader() {
  cy.get(SELECTORS.singInButtonInHeader).click();
}
function clickOnSignUpButtonInHeader() {
  cy.get(SELECTORS.singUpButtonInHeader).click();
}
function clickOnDoNotHaveAnAccountButton() {
  cy.get(SELECTORS.doNotHaveAnAccountButton).click();
}
function fillFirstNameInput(value: string) {
  cy.get(SELECTORS.singUpFirstNameInput).type(value);
}
function fillLastNameInput(value: string) {
  cy.get(SELECTORS.signUpLastNameInput).type(value);
}
function fillEmailInput(value: string) {
  cy.get(SELECTORS.signUpEmailInput).type(value);
}
function clickOnSignUpButton() {
  cy.getByTestId(SELECTORS.signUpButtonInSignUpForm).click();
}
function clickOnSignInButton() {
  cy.get(SELECTORS.signInButton).click();
}
// #endregion

export const user = {
  fillEmailInput,
  fillLastNameInput,
  fillFirstNameInput,
  clickOnSignInButton,
  clickOnSignUpButton,
  clickOnSignInButtonInHeader,
  clickOnSignUpButtonInHeader,
  clickOnDoNotHaveAnAccountButton,
};

// #region verifiers
function successfulSignUp() {
  cy.get(SHARED_SELECTORS.notification).should(
    'have.text',
    'Signed up successfully, Now check your email!',
  );
}
function signUpFormExists() {
  cy.get(SELECTORS.signUpEmailInput).should('be.visible');
  cy.get(SELECTORS.signUpLastNameInput).should('be.visible');
  cy.get(SELECTORS.singUpFirstNameInput).should('be.visible');
  cy.getByTestId(SELECTORS.signUpButtonInSignUpForm).should(
    'be.visible',
  );
}
function logo() {
  cy.get(SELECTORS.logo).should('exist').should('contain', 'you-say');
}
function notFoundPage() {
  cy.get(SELECTORS.notFoundTitle).should('contain', '404');
  cy.get(SELECTORS.notFoundMessage).should(
    'contain',
    'Page not found',
  );
  cy.get(SELECTORS.notFoundLink)
    .should('contain', 'Go to the front page →')
    .should('have.attr', 'href', '/');
}
function successfulSignIn() {
  // TODO: show a notification saying "We've logged you in!", see apps/frontend/src/config.ts
  cy.url().should('include', Cypress.env('FRONTEND_URL'));
  cy.url().should('include', 'userState=Authenticated');
}
// #endregion

export const verify = {
  logo,
  notFoundPage,
  successfulSignIn,
  successfulSignUp,
  signUpFormExists,
};
