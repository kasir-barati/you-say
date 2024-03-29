```cmd
npx create-nx-workspace@latest you-say --preset=nest --pm pnpm
nx add @nx/next
nx g @nx/next:app apps/frontend
```

# you-say

## Integrate with editors

Enhance your Nx experience by installing [Nx Console](https://nx.dev/nx-console) for your favorite editor. Nx Console
provides an interactive UI to view your projects, run tasks, generate code, and more! Available for VSCode, IntelliJ and
comes with a LSP for Vim users.

## Important notes about `Nx`

1. Make sure to install the `@nx/whatever` version that matches the version of `nx` in your repository. If the version numbers get out of sync, you can encounter some difficult to debug errors. You can [fix Nx version mismatches with this recipe](https://nx.dev/recipes/tips-n-tricks/keep-nx-versions-in-sync).
2. Nx plugins lift the burden of things like scaffolding a new app (e.g. NestJS, NextJS), testing, building, etc

## Start the application

Run `nx dev backend` to start the development server. Happy coding!

# Nx scripts

**Note**, we usually do not have to involve ourselves with these commands since we just wanted to develop the app in our local env via utilizing docker compose and for prod we will use tools such as CI/CD. But for you to have a better understanding I wrote this part. BTW the image for both prod and dev env have the same tag and version.

## Backend

### Build the NestJS app with tsc

Run `nx build backend` to build the application. The build artifacts are stored in the output directory (`./dist/`), ready to be deployed.

### Build the docker image for backend app in dev env

Run `nx build:dev:docker backend`

### Build the docker image for backend app in prod env

Run `nx build:docker backend`

### Cleanup backend

Run `nx cleanup backend` to:

1. Remove all the containers created by the `docker-compose.yml`
2. Execute `docker system prune`
3. Remove the built artifacts for backend

### Run e2e tests for backend

Run `nx test:e2e:docker backend-e2e` to run the e2e tests from scratch.
Run `nx test:e2e backend-e2e` if you only touched the unit tests and not the codes of the backend and you are are sure that data is not corrupted.

## Frontend

### Building NextJS app

Run `nx build:docker frontend` to build it in production mode
Run `nx build:docker frontend --configuration=dev` to build it in development mode:

- It won't utilizes caching mechanism during building docker image

**Note**: Do not use these two configuration options in your `next.config.js`, since by doing that it is gonna make it harder for us to build our app: `output: 'export'` and `distDir: '../../dist/apps/frontend'`. Better to follow the their [official docs](https://nextjs.org/docs/app/building-your-application/deploying#docker-image).

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
