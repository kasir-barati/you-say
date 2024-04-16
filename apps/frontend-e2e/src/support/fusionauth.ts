const SELECTORS = {
  loginIdInput: 'loginId',
  passwordIdInput: 'password',
  submitButton: 'submit',
};

export function fillLoginIdInput(value: string) {
  cy.get(`[id=${SELECTORS.loginIdInput}]`).type(value);
}
export function fillPasswordInput(value: string) {
  cy.get(`[password=${SELECTORS.passwordIdInput}]`).type(value);
}
export function clickOnSubmitButton() {
  cy.get(`[id=${SELECTORS.submitButton}]`).click();
}
