# Some general notes:

1. We are letting `openapi-generator-cli` to handle the generation of axios for us. And this library's input to generate the axios is `openApi.json`. We are creating that file based on our docs for swagger. So it is imperative to annotate all the endpoints and their queries/cookies/body in order to have a complete auto generated `openApi.json` file.
