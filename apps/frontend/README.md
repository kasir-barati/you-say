# CLI

## Add new page/component

```cli
nx g @nx/next:page my-new-page --directory=dir-where-to-place-the-page
nx g @nx/next:component my-new-component --directory=dir-where-to-place-the-component
```

# Add a new NextJS app

```cli
nx g @nx/next:application appName --directory apps/appName
```

# Expanding `process.env` types

We needed to create a new type declaration file called `env.d.ts` to declare our environmental variables, [read more](https://nextjs.org/docs/pages/building-your-application/configuring/typescript#custom-type-declarations).

# Mocking

- NextJS's font optimization has built-in automatic self-hosting for any font file. The optimization automatically downloads any Google font and places Google and local fonts into an app's static assets all at **BUILD** time. When running tests it's important to mock the module import `next/font/google` and/or `next/font/local` depending on which font optimization you're using.
