# Rules and regulations

1. Do not import anything from other packages inside the shared package.
2. Do not import anything from apps in packages.
3. Do not include anything outside of the package in the package's `tsconfig.json` since it causes issues with the build process.
4. Backend packages can be a normal Nx package or a dynamic module.
5. We are calling each reuseable and shareable part a `package` instead of `library` but in practice I do not see any difference between them. So keep that in mind.

# Add new package

Run `nx g @nx/js:lib packages/backend/libName`
Or run `nx g @nx/js:lib packages/frontend/libName`

> [!NOTE]
>
> If your package is not a publishable package, then to prevent your linter from failing because of this error: [`The "packageName" project uses the following packages, but they are missing from "dependencies":`](https://github.com/nrwl/nx/issues/19307), make sure to turn off the `@nx/dependency-checks` in the respective `.eslintrc.json` file.

# Build

It seems like that we do not need to execute `nx build packageName` for each application that uses this lib for some reason. Maybe it is handled behind the scene by Nx CLI while building the app, so all we need is to copy it in the `Dockerfile` before executing `RUN npx nx build appName`?
