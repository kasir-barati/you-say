# Build

It seems like that we do not need to execute `nx build packageName` for each application that uses this lib for some reason. Maybe it is handled behind the scene by Nx CLI while building the app, so all we need is to copy it in the `Dockerfile` before executing `RUN npx nx build appName`?
