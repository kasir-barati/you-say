> [!IMPORTANT]
>
> Note that we are using same terminology for backend and frontend app when it comes to testing strategies we've used so far. This is a living document, as such please keep it up to date and do not hesitate to raise questions or doubts about it.

# you-say

```cmd
npx create-nx-workspace@latest you-say --preset=nest --pm pnpm
nx add @nx/next
nx g @nx/next:app apps/frontend
```

# Why are we using X technology?

| name       | explanation/reason                                        |
| ---------- | --------------------------------------------------------- |
| FusionAuth | Offloading login security and functionality to FusionAuth |

## Testing strategy

- We are gonna follow -- Extract the essence of these posts and videos and jot it down here and keep these links as reference.
  - [Kent C. Dodds - How to know what to test?](https://youtu.be/ahrvE062Kv4?si=iagHA6ZxgwdY4j9G)
  - [Kent C. Dodds - Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing)
  - [Kent C. Dodds - Write tests. Not too many. Mostly integration](https://kentcdodds.com/blog/write-tests)
  - [Should you test child components or parent components? Or both?](https://www.youtube.com/live/0qmPdcV-rN8?si=QsNiG9Jtyke1hXL_)
    - Test the 'happy path' (which you could treat as the default path) in the parent component which will capture the behaviour of the child components in the default state.
    - Logic inside the child component that changes the behaviour/UI of the child component due to a non-default prop value, capture that in the child component's test file.
  - [Static vs Unit vs Integration vs E2E Testing for Frontend Apps](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests)
  - [Confident React - Frontend Testing with Kent C. Dodds](https://youtu.be/eg_TFYF_cKM?si=qGluI5Zpgcc_a8bp)

// TODO: Move "Dictionary" to code of conduct

### Dictionary

Here we will briefly touch what we mean by each buzzword we used or will use, I hope this have eliminated some of the confusions around what does each term means:

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

## Important notes about `Nx`

1. Make sure to install the `@nx/whatever` version that matches the version of `nx` in your repository. If the version numbers get out of sync, you can encounter some difficult to debug errors. You can [fix Nx version mismatches with this recipe](https://nx.dev/recipes/tips-n-tricks/keep-nx-versions-in-sync).
2. Nx plugins lift the burden of things like scaffolding a new app (e.g. NestJS, NextJS), testing, building, etc
3. You can use `nx graph` and `nx show projects` to see what is going on in your monorepo.
4. Upgrade dependencies: `nx migrate latest`.
   Please note that this command is not gonna upgrade your devDeps and deps to the latest version. It is only upgrading nx and its belongings. So we can use other approaches to upgrade our dependencies:
   ```cmd
   npm outdated
   npm update
   ```
   But most of the times `npm update` will not do the trick. So in those cases we need to rely on tools such as [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
   ```cmd
   npm install -g npm-check-updates
   ncu
   ```
   if do not need `migrations.json` (scenarios such as applying same migration in other branches) remove it.

## Start the application

Run `nx dev backend` to start the development server. Happy coding!

# Nx scripts

**Notes:**

- Unit tests are executed by running `nx appOrPkgName test`
- We usually do not have to involve ourselves with these commands since we just wanted to develop the app in our local env via utilizing docker compose and for prod we will use tools such as CI/CD. But for you to have a better understanding I wrote this part. BTW the image for both prod and dev env have the same tag and version.
- Read each `README.md` file for package/app in order to learn more. Also sometimes we do not have them all in `README.md`s documented, in those cases you can always check respective `project.json` files or `nx.json`.

## Running tasks

To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Set up CI!

### GitHub actionlint

Husky validates GH actions via [actionlint](https://github.com/rhysd/actionlint) before commit if they were changed or a new one was added:

```cmd
sudo pacman -Syu actionlint
```

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)
