```cmd
npx create-nx-workspace@latest you-say --preset=nest --pm pnpm
nx add @nx/next
nx g @nx/next:app apps/frontend
```

# you-say

For local development and starting app in Docker we need `FUSIONAUTH_HOST=http://fusionauth:9011` but for e2e we need to change it to `FUSIONAUTH_HOST=http://localhost:9011` because of how docker containers see each other.

## Integrate with editors

Enhance your Nx experience by installing [Nx Console](https://nx.dev/nx-console) for your favorite editor. Nx Console
provides an interactive UI to view your projects, run tasks, generate code, and more! Available for VSCode, IntelliJ and
comes with a LSP for Vim users.

## Start the application

Run `nx start:docker backend` to start the development server. Happy coding!

## Build for production

Run `nx build backend` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.

## Cleanup backend

Run `nx cleanup backend` to:

1. Remove all the containers created by the `docker-compose.yml`
2. Execute `docker system prune`
3. Remove the built artifacts for backend

## Run e2e tests for backend

Run `nx start:docker backend-e2e` to run the e2e tests from scratch.
Run `nx start backend-e2e` if you only touched the unit tests and not the codes of the backend and you are are sure that data is not corrupted.

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

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)
