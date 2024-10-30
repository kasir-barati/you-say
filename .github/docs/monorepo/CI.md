# CI

With Nx our CI:

- Runs only tasks affected by a PR.
- Shares the task cache between CI and local development machines (Nx Replay).
- Distributes task execution across multiple agent machines (Nx Agents).
- Automatically split long e2e tasks into smaller tasks (Atomizer).
- Identifies and rerun flaky tasks.
  - Not limited to CI, but also works for e2e tests.
