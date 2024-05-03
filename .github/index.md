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

# Actions

Here You'll find some general docs about actions we used in this project and some cautionary and or important notes.

## GitHub script action

Notes:

- If you are banging your head against a brick wall on how on earth you might know what you should pass to it better to first check these docs:
  - [github-script DOC](https://github.com/actions/github-script)
  - [octokit/rest.js DOC](https://octokit.github.io/rest.js/v20): In this doc remember to click on "See also: GitHub Developer Guide documentation." link for in-depth documentation.
  - Search the method on [sourcegraph](https://sourcegraph.com/search) and try to filter the results to cater your specific use case. It is possible that someone out there already had implemented what you are trying to accomplish.
- [`context.sha` is the same as `GITHUB_SHA`](https://github.com/actions/toolkit/blob/main/packages/github/src/context.ts#L42), meaning that we are getting workflows that were triggered for the latest commit we made.

  > [!CAUTION]
  >
  > So please be careful with this, since if you're making commits using this tool it might leads to unexpected commit statuses. Just be mindful of how you are utilizing this GitHub action.

# Workflows

> [!CAUTION]
>
> Our `final-workflow.workflow.yml` is gonna be executed more that one time since according to the GitHub [official doc](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_run) if we pass an array of workflows it is gonna run it whenever one of them met the `types` condition stated in the workflow. Which is really annoying but considering everything I guess it is not gonna take a toll on our bills and cheques :grinning:.
>
> We could not also chain the workflows since it is not really possible to chain more than 3 level of workflows. It is not also really viable and feasible to do so since it slows us down and our feedback loop.
>
> So you might ask why we can execute it several times and be sure that our final commit status will be a credible one? It is because of `const isSuccessful = workflowRuns.every(run => run.conclusion === 'success');`. We are betting on that :smile:.

## Backend CI

The purpose of this workflow is to automatically run whenever code is pushed to the main branch. This allows the codebase to be continuously built, tested, and validated whenever changes are made.

The main logic flow is that whenever code is pushed, this workflow will kick off and run all these steps automatically. Important flows are the parallelization to speed up the pipeline, caching to optimize installs, and running against only affected code to make it faster.

By continuously integrating these steps on every push, it helps maintain code quality and catch issues early. It also helps with the [trunk base development approach](https://trunkbaseddevelopment.com/). The developer gets rapid feedback if any tests fail or code styles diverge. Over time this workflow helps enforce code health and stability.

## Backend e2e

Notes:

- We may want to reconsider on how and where we are running our e2e tests. Transitioning from GitHub runners to a self-hosted runner would likely prove more economical.
- We are using a `docker-compose` for sake of ease of use.
- We are utilizing the `success()` built-in function provided by GitHub Actions to check whether the previous step or job was successful.

## Frontend e2e

Notes:

- We are gonna run them only if all the tests and CI pipeline passes; this includes e2e "Backend e2e tests" workflow and "Continuous Integration" workflow.

## Storybook tests

Notes:

- We separated them from frontend e2e tests to have a clear boundary between e2e tests written with Cypress and Storybook tests which are less Integration Testing theme and more on the side of UI/UX sanity check for out frontend apps.
- We separated them from normal unit tests performed in `ci.workflow.yml` since these are tests that we tends to execute them as the last pipeline. After all other tests and pipelines successfully completed (different e2e tests and unit test + other CI/CD pipelines) we wanna tests our UI/UX and probably also share our final work with other teammates; PM, UI/UX designer, another frontend developer.

## CD

When we want to automate deployment of our applications we need to make sure that the commit status is `success`

# Possible enhancements:

1. [Rerun tests automatically if retry is meaningful](https://sourcegraph.com/github.com/flix/flix@f9db49d57ae326ab90115a14eda2e185f542a857/-/blob/.github/workflows/rerun-on-demand.yaml)
2.
