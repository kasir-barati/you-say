# Scripts

- `nx build backend` builds the application. The build artifacts are stored in the output directory (`./dist/`), ready to be deployed.
- `nx build:docker backend` builds the docker image for backend app in prod env
  - `nx build:docker backend --no-cache` if you wanna ignore docker caches
- `nx cleanup backend` cleanup backend
  1. Remove all the containers created by the `docker-compose.yml`
  2. Execute `docker system prune`
  3. Remove the built artifacts for backend
