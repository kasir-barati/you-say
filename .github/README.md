# Composite actions

They are like function, you can use them as many times as you want but they come with their limitations, e.g. you can specify env variables at the `step-level` but you cannot do it at a higher level like what you can do in workflows ([read more](https://github.com/orgs/community/discussions/51280)).

You also need to comply with their convention of directory structure and how you are gonna use them;

1. You need to `mkdir .github/actions`
2. Then create a new directory in the created directory in the previous step
3. Now you inside that you can create your composite action; e.g.
   ```cmd
   mkdir -p .github/actions/terraform-composite
   touch .github/actions/terraform-composite/action.yml
   ```
   And use it like this in your workflow:
   ```yml
   uses: ./.github/actions/terraform-composite
   ```
   Learn more:
   - [Stackoverflow Q&A](https://stackoverflow.com/q/74350826/8784518)
   - [GitHub actions doc](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-an-action-in-the-same-repository-as-the-workflow)

# Workflows

Here we are gonna break our GH actions and what each workflow does for us.

## Backend CI

The purpose of this workflow is to automatically run whenever code is pushed to the main branch. This allows the codebase to be continuously built, tested, and validated whenever changes are made.

The main logic flow is that whenever code is pushed, this workflow will kick off and run all these steps automatically. Important flows are the parallelization to speed up the pipeline, caching to optimize installs, and running against only affected code to make it faster.

By continuously integrating these steps on every push, it helps maintain code quality and catch issues early. It also helps with the [trunk base development approach](https://trunkbaseddevelopment.com/). The developer gets rapid feedback if any tests fail or code styles diverge. Over time this workflow helps enforce code health and stability.

## Backend e2e

Notes:

- We may want to reconsider on how and where we are running our e2e tests. Transitioning from GitHub runners to a self-hosted runner would likely prove more economical.
- We are using a `docker-compose` for sake of ease of use.
- We are utilizing the `success()` built-in function provided by GitHub Actions to check whether the previous step or job was successful.
