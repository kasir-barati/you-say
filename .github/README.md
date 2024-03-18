# Workflows

Here we are gonna break our GH actions and what each workflow does for us.

## Backend CI

The purpose of this workflow is to automatically run whenever code is pushed to the main branch. This allows the codebase to be continuously built, tested, and validated whenever changes are made.

The main logic flow is that whenever code is pushed, this workflow will kick off and run all these steps automatically. Important flows are the parallelization to speed up the pipeline, caching to optimize installs, and running against only affected code to make it faster.

By continuously integrating these steps on every push, it helps maintain code quality and catch issues early. It also helps with the [trunk base development approach](https://trunkbaseddevelopment.com/). The developer gets rapid feedback if any tests fail or code styles diverge. Over time this workflow helps enforce code health and stability.
