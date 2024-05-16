# `@fusionauth/react-sdk`

- The `openid`, `profile`, and `offline_access` are scopes that can be used in OAuth2 and OpenID Connect requests.
  - `openid`: Is required for OpenID Connect requests. It signals the OAuth server to return an `id_token` which contains user identity information.
  - `offline_access`: Can be used to request a refresh token. When this scope is included, the OAuth server will return a refresh token along with the access token. The refresh token can be used to obtain a new access token when the current one expires.
  - `profile`: An optional scope that can be used in OpenID Connect requests. When this scope is included, the OAuth server will return claims about the user's profile information, such as name, family name, and others. This library sends the `openid offline_access` as scope to our backend. Therefore we can manipulate it in our backend if needed.

# Scripts

## Building NextJS app

- Run `nx build:docker frontend` to build it in production mode
- Run `nx build:local frontend` to build it in your own system
- It won't utilizes caching mechanism during building docker image

**Note**: Do not use these two configuration options in your `next.config.js`, since by doing that it is gonna make it harder for us to build our app: `output: 'export'` and `distDir: '../../dist/apps/frontend'`. Better to follow the their [official docs](https://nextjs.org/docs/app/building-your-application/deploying#docker-image).

## Add New page/component

```cli
nx g @nx/next:page my-new-page --directory=dir-where-to-place-the-page
nx g @nx/next:component my-new-component --directory=dir-where-to-place-the-component
```

## Storybook

To comply with the Nx we needed to use `nx` CLI to add and configure Storybook. You can read more about it [here](https://nx.dev/nx-api/storybook). BTW this script is gonna install old versions of storybook so you need to migrate from what it is to the latest; things like `@storybook/test` is introduces which relief us from having `@storybook/jest` and `@storybook/testing-library`, [learn more here](https://storybook.js.org/blog/storybook-test/).

```cmd
nx add @nx/storybook
nx g @nx/storybook:configuration frontend
```

Here are some general good to know infos:

1. To skip a test in Storybook we can simply say `tags: ["skip"]` in the `Story` object, [learn more about it here](https://github.com/storybookjs/test-runner?tab=readme-ov-file#filtering-tests-experimental).

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
