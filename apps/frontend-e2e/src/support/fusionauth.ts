const SELECTORS = {
  loginIdInput: '[id="loginId"]',
  passwordIdInput: '[id="password"]',
  submitButton: '[id="submit"]',
};

function fillLoginIdInput(value: string) {
  cy.get(SELECTORS.loginIdInput).type(value);
}
function fillPasswordInput(value: string) {
  cy.get(SELECTORS.passwordIdInput).type(value);
}
function clickOnSubmitButton() {
  cy.get(SELECTORS.submitButton).click();
}

export const user = {
  fillLoginIdInput,
  fillPasswordInput,
  clickOnSubmitButton,
};
