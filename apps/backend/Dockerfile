# Build the docker image with `nx build:docker backend`.
#
# Run the container with `docker run -p 3001:3001 -t backend`.
FROM docker.io/node:20.10.0-alpine AS build_stage
WORKDIR /build
COPY tsconfig.base.json jest.preset.js nx.json ./
COPY package*.json ./
# README: Why --ignore-scripts? https://github.com/typicode/husky/issues/920#issuecomment-809851650
RUN npm ci --ignore-scripts
COPY apps/backend/healthcheck.js .
COPY apps/backend ./apps/backend
RUN npx nx build backend

FROM docker.io/node:20.10.0-alpine
RUN addgroup --system backend && \
    adduser --system -G backend backend
WORKDIR /app
COPY --chown=backend:backend --from=build_stage /build/node_modules /build/healthcheck.js ./
COPY --chown=backend:backend --from=build_stage /build/package*.json ./
RUN npm prune --omit=dev
COPY --chown=backend:backend --from=build_stage /build/dist/apps/backend ./

EXPOSE 3001

CMD [ "node", "src/main.js" ]