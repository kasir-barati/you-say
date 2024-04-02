# Auth

Auth package, created and will serve our backend application to communicate and work with FusionAuth API. Task such as registering new users etc will be managed and handled by this package.

#### Super important: This package comes with its own RESTful API, so be aware of it. It is defined under `/auth` and you can find them in `packages/backend/auth/src/lib/auth.controller.ts`

## Building

Run `nx build @backend/auth` to build the library.

## Running unit tests

Run `nx test @backend/auth` to execute the unit tests via [Jest](https://jestjs.io).

**We will test its general functionality and how it works in real world in e2e tests and integration tests in our backend app.**
