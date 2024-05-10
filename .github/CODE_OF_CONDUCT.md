> [!IMPORTANT]
>
> Note that we are using same terminology for backend and frontend app when it comes to testing strategies we've used so far. This is a living document, as such please keep it up to date and do not hesitate to raise questions or doubts about it.

# Technical Glossary

Here we will briefly touch what we mean by each buzzword we used or will use, I hope this have eliminated some of the confusions around what does each term means.

| Terminology or jargon | Description                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| OAuth server          | FusionAuth                                                                         |
| JWKS                  | JSON Web Key Set ([SuperTokens](https://supertokens.com/blog/understanding-jwks)). |
| JWT                   | JSON Web Tokens ([wikipedia](https://en.wikipedia.org/wiki/JSON_Web_Token)).       |

## Test

1. **Smoke Tests**: We are gonna make sure that it is gonna be able to run without error, or be used without any kind of error. Here are some examples that I think are Smoke Tests;
   - If I use this component and pass the props (if needed) will it render?
   - Calling this method/function will cause my app to break or it is OK -- Note that we are not talking about what it returns, we are just interested in being callable, we will test its logic in **Sanity Tests**.
2. **Sanity Tests**: Simple tests that check if it is the way it should be and sanity wise it makes sense. Let's look at some examples;
   - Does it have the right css class.
   - Does it behave as it should or it is misbehaving.
3. **Integration Tests**: They are testing different pieces of a system assembled together. Let's clarify it with more tangible scenarios:

   - **backend** app needs FusionAuth, MongoDB, and PostgreSQL to function and work properly. Without one of them it will not. So when we say Integration Tests written for backend app we mean that it is gonna test backend and see if is working.
   - **frontend** needs _backend_, in a sense you could say it is higher level than Integration Tests written for _backend_ app, but I think they can be categorized in the same league since we could have a microservice and backend could be a collection of different NestJS apps that have their own e2e tests but all of them shape what we call _backend_.

> [!CAUTION]
>
> It might be a little confusing hearing _backend_ as a name for an app. But think of it as a crude name for a NestJS app :disappointed:.

4. **Unit tests**: It can be _Smoke Test_ or _Sanity Test_.
5. **E2E tests**: I consciously decided to use _e2e tests_ and _Integration Tests_ interchangeably.
6. **Security Tests**: Tests that assess authentication and authorization layers, we are also checking our RESTful API interfaces and if we can call them by passing invalid data or miss some part of them that are necessary.
7. **System Tests**: Here is where actually business lives, from registering a user to logics for whatever it might be. But make no mistake, we are not gonna test everything here. We will only tests **CBP** here and try to spread the burden to unit test layer. If each unit works as expected there are little that might go wrong.
8. **Regression Tests**: in _System Tests_ we said "there are little that might go wrong" when we have well tested units but if something might go wrong, it will. So that's where _Regression Tests_ comes into picture. We will thoroughly test bugs, UI/UX issues, and functionality enhancements in regression tests.

> [!CAUTION]
>
> Note: these are all only _Functional Testing_ and not _Non-functional Tests_. _Non-functional Tests_ covers things like: _Compatibility Tests_, _Performance Tests_, etc. We are covering _Security Tests_ partially thanks to efforts done in backend's e2e tests but not enough to speak about _Security Tests_ as if we've taken them seriously, we're barely scratching the surface and we are not tests it thoroughly as of now.

I used these resources to draw the lines a define boundaries and a little bit of my personal knowledge:

1. https://testsigma.com/blog/the-different-software-testing-types-explained/
2. https://stackoverflow.com/a/4069450/8784518
