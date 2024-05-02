# Scripts

## Run e2e tests for backend

- `nx test:e2e:docker backend-e2e` starts backend application, and then execute e2e tests against it.
- `nx test:e2e backend-e2e` starts integration tests; if you only touched the unit tests and not the codes of the backend and you are are sure that data is not corrupted.

# Some general notes:

1. We are letting `openapi-generator-cli` to handle the generation of axios for us. And this library's input to generate the axios is `openApi.json`. We are creating that file based on our docs for swagger. So it is imperative to annotate all the endpoints and their queries/cookies/body in order to have a complete auto generated `openApi.json` file.
