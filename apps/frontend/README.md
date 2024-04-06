# CLI

## Add

### New page/component

```cli
nx g @nx/next:page my-new-page --directory=dir-where-to-place-the-page
nx g @nx/next:component my-new-component --directory=dir-where-to-place-the-component
```

### Storybook

To comply with the Nx we needed to use `nx` CLI to add and configure Storybook. You can read more about it [here](https://nx.dev/nx-api/storybook). BTW this script is gonna install old versions of storybook so you need to migrate from what it is to the latest; things like `@storybook/test` is introduces which relief us from having `@storybook/jest` and `@storybook/testing-library`, [learn more here](https://storybook.js.org/blog/storybook-test/).

```cmd
nx add @nx/storybook
nx g @nx/storybook:configuration frontend
```

#### FIXME

We are having an issue with the storybook and what they do; as of 06.04.2024 storybook generates a `package.json` for us and we need to remove it. [It is planned to be fixed by storybook team](https://github.com/storybookjs/storybook/issues/26263). Currently I am gitignoring it, waiting for a permanent solution from storybook team.

#### Available scripts:

1. `nx storybook frontend`
2. `nx test-storybook frontend`
3. `nx build-storybook frontend`

# Add a new NextJS app

```cli
nx g @nx/next:application appName --directory apps/appName
```

# Expanding `process.env` types

We have had created a new type declaration file called `env.d.ts` to declare our environmental variables, [read more](https://nextjs.org/docs/pages/building-your-application/configuring/typescript#custom-type-declarations). So in case you need to add a new env please add there

# Mocking

- NextJS's font optimization has built-in automatic self-hosting for any font file. The optimization automatically downloads any Google font and places Google and local fonts into an app's static assets all at **BUILD** time. When running tests it's important to mock the module import `next/font/google` and/or `next/font/local` depending on which font optimization you're using.
