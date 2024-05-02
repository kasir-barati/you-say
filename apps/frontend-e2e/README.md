# [Read _Testing strategy_ section here](../../README.md#testing-strategy)

# Scripts

- `nx test:e2e:docker frontend-e2e` starts backend application and then running cypress e2e tests against our frontend app
- `nx e2e frontend-e2e` starts cypress tests; our backend might be already up and running and we just have changed something in our cypress test or frontend application implementation.
- Run `nx open-cypress frontend-e2e` to see the Cypress browser if you need it.
  > [!NOTE]
  >
  > If you wanna execute this command you need to start backend manually beforehand: `nx dev backend`

# Cypress lint errors

> [!NOTE]
>
> These lint errors are adapted and emerged out of best practices with Cypress. [You can find out more here](https://docs.cypress.io/guides/references/best-practices).

1. If you've got this error:
   ```cmd
   It is unsafe to chain further commands that rely on the subject after this command. It is best to split the chain, chaining again from `cy.` in a next command line  cypress/unsafe-to-chain-command
   ```
   In short it is complaining that in your command chaining you have actions in between; meaning our last chain should be an action like `click` or `type` etc. Or checks like `should` or `contain` etc.
