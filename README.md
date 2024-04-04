```cmd
npx create-nx-workspace@latest you-say --preset=nest --pm pnpm
nx add @nx/next
nx g @nx/next:app apps/frontend
```

# you-say

## Testing strategy

Some general rule of thumb:

- Test once, following DRY principle; meaning to not cover same UI, behavior in more than one place.

We are gonna cover most cases in integration tests written for our backend app, to be clear I am gonna list them here:

1. DTO validations
2. RBAC and permissions check
3. Backend error and success responses

And then we will make sure that our frontend is working as expected, since I do not have a form validator as of now and I am relying totally on native HTML validators I am not going to test it thoroughly. Besides that we have testing strategy for the frontend application:

1. Test props in Jest
2. Test UI and functionalities via storybook
3. We will try to test **Critical Business Paths (will be referred to as CBP too)** and not everything; e.g. we will not check if user is trying to register to see the error thrown by backend that there is a registered user with the entered email address. But rather we will just try to register and see if we can do it.
   > [!IMPORTANT]
   >
   > Right now we are returning error message from our backend app, but when we migrate from throwing error messages to error code in our backend we need to change this policy too!

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

## Backend

### Build the NestJS app with tsc

Run `nx build backend` to build the application. The build artifacts are stored in the output directory (`./dist/`), ready to be deployed.

### Build the docker image for backend app in prod env

Run `nx build:docker backend`
Run `nx build:docker backend --no-cache` if you wanna ignore docker caches

### Cleanup backend

Run `nx cleanup backend` to:

1. Remove all the containers created by the `docker-compose.yml`
2. Execute `docker system prune`
3. Remove the built artifacts for backend

### Run e2e tests for backend

Run `nx test:e2e:docker backend-e2e` to start backend application, and then execute e2e tests against it.
Run `nx test:e2e backend-e2e` if you only touched the unit tests and not the codes of the backend and you are are sure that data is not corrupted.

## Frontend

### Building NextJS app

Run `nx build:docker frontend` to build it in production mode
Run `nx build:docker frontend --configuration=dev` to build it in development mode:

- It won't utilizes caching mechanism during building docker image

**Note**: Do not use these two configuration options in your `next.config.js`, since by doing that it is gonna make it harder for us to build our app: `output: 'export'` and `distDir: '../../dist/apps/frontend'`. Better to follow the their [official docs](https://nextjs.org/docs/app/building-your-application/deploying#docker-image).

### Run e2e tests for frontend

Run `nx test:e2e:docker frontend-e2e` to start backend application and then running cypress e2e tests against our frontend app
Run `nx e2e frontend-e2e` if you do not need backend application; our backend might be already up and running and we just have changed something in our cypress test or frontend application implementation.

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
