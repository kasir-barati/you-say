# [`@nx/js:node`](https://nx.dev/nx-api/js/executors/node)

- NodeJS app executor.

```json
{
  "targets": {
    "serve": {
      "executor": "@nx/js:node",
      "options": {
        // Use `runtimeArgs` to pass args to the underlying nodejs command (NodeJS CLI arguments)
        "runtimeArgs": ["--no-warnings"],
        // Nx build automatically all deps of your app.
        // E.g. when your build have to consumes a library from its output, not its source.
        "runBuildTargetDependencies": true,
        // Extra args when starting the app.
        "args": ["--job", "worker"],
        // Ensures the app is starting with debugging.
        "inspect": "inspect",
        // The host to inspect the process on.
        // Default: localhost
        "host": "localhost",
        // The port to inspect the process on. Setting port to 0 will assign random free ports to all forked processes.
        // Default: 9229
        "port": 108
      }
    }
  }
}
```

- Learn more about other available options [here](https://nx.dev/nx-api/js/executors/node#options-playground).
