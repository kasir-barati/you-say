# How to create new tickets in backlog

# Before moving a ticket to in progress column

Ask these questions first:

1. Do we have all the necessary info to start it?
2. Have we ever done something similar in the past?
3. What technical challenges we might face in this ticket?
4. Do we care about non-functional requirements?
   - Scalability.
   - Security.
   - Performance.
5. Can we modularize or reuse something?
6. What kind of tests do we need for it?
   - Smoke test.
   - Regression test.
   - Sanity test.
7. Is there other tickets related/connected to this ticket?

## Start the application

Run `nx dev backend` to start the development server. Happy coding!

### GitHub actionlint

Husky validates GH actions via [actionlint](https://github.com/rhysd/actionlint) before commit if they were changed or a new one was added:

```cmd
sudo pacman -Syu actionlint
```

# A rule of thumb on how to edit [Technical Glossary](./CODE_OF_CONDUCT.md#technical-glossary):

- **Clarity**: Add terms that may be ambiguous or subject to interpretation to prevent misunderstanding and conflicts.
- **Accessibility**: More accessible to a wider audience, including newcomers and may not be familiar with certain technical terminology.
- **Consistency**: Promoting consistency in communication within this project by ensuring that everyone uses terms in the same way. Fostering a cohesive and inclusive community.
- **Reference**: Easer to reference key terms as needed, without having to search for definitions elsewhere.
- **Transparency**: It is a sign of commitment to transparency and clarity in this project's governance and communication practices.

# Important notes about `Nx`

1. Make sure to install the `@nx/whatever` version that matches the version of `nx` in your repository. If the version numbers get out of sync, you can encounter some difficult to debug errors. You can [fix Nx version mismatches with this recipe](https://nx.dev/recipes/tips-n-tricks/keep-nx-versions-in-sync).
2. Nx plugins lift the burden of things like scaffolding a new app (e.g. NestJS, NextJS), testing, building, etc
3. You can use `nx graph` and `nx show projects` to see what is going on in your monorepo.
4. Upgrade dependencies: `nx migrate latest`.
   Please note that this command is not gonna upgrade your devDeps and deps to the latest version. It is only upgrading `nx` and its belongings. So we can use other approaches to upgrade our dependencies:
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

# How to tests

- Run `nx appOrPkgName test` for unit test

## Testing strategy

- We are gonna follow -- Extract the essence of these posts and videos and jot it down here and keep these links as reference.
- [Kent C. Dodds - How to know what to test?](https://youtu.be/ahrvE062Kv4?si=iagHA6ZxgwdY4j9G)
- [Kent C. Dodds - Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing)
- [Kent C. Dodds - Write tests. Not too many. Mostly integration](https://kentcdodds.com/blog/write-tests)
- [Should you test child components or parent components? Or both?](https://www.youtube.com/live/0qmPdcV-rN8?si=QsNiG9Jtyke1hXL_)
  - Test the _happy path_ (which you could treat as the default path) in the parent component which will capture the behaviour of the child components in the default state.
  - Logic inside the child component that changes the behaviour/UI of the child component due to a non-default prop value, capture that in the child component's test file.
- [Static vs Unit vs Integration vs E2E Testing for Frontend Apps](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests)
- [Confident React - Frontend Testing with Kent C. Dodds](https://youtu.be/eg_TFYF_cKM?si=qGluI5Zpgcc_a8bp)
