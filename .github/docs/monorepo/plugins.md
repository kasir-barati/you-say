# Plugins

| Plugin        | Link to it                             |
| ------------- | -------------------------------------- |
| `@nx/js:node` | [Click here](./nx-js-node-executor.md) |

- NPM packages.
- Build on top of the fundamental capabilities provided by the Nx.
- Contain code generators, [executors](./glossary.md#executorDefinitionInGlossary) and automated code migrations for keeping your tools up to date.
- Are usually technology specific.
- Increases productivity by removing any friction of integrating different tools with each other and by providing utilities to keep them up to date.
- Use the `@nx/plugin` package to easily scaffold a new plugin or even just automate your local workspace.

## Generate code

As part of plugins we can generate code to:

- Scaffold new projects easier.
- Add new features like adding Storybook to existing projects.
- Automate repetitive tasks in development workflow.
- Promote consistency and following best practices.

To do so we need to:

1. Add the plugin to our workspace: e.g. `nx add @nx/express`.
2. Run `nx g @nx/express:application --help` to see all the available options you can specify for your new lovely ExpressJS app.
3. Get rif of that damn webpack by doing similar to what I did [here](https://github.com/kasir-barati/you-say/commit/51094a6c3f5b3c94ea95b1104038f58ed00ef6f9).

## Webpack plugin -- `@nx/webpack/plugin`

- **The basic plugin** works with a standard webpack configuration file, and adds them to the plugins option.
- `NxAppWebpackPlugin`provides common confs for the build. Thins like TypeScript support and linking workspace libraries (via `paths` conf declared in `tsconfig.json`).
