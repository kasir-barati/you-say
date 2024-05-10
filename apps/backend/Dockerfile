# Build the docker image with `nx build:docker backend`.
#
# Run the container with `docker run -p 3001:3001 -t you-say-api-image`.
FROM docker.io/node:20.10.0-alpine AS build_stage
WORKDIR /build
COPY tsconfig.base.json .eslintrc.json jest.preset.js nx.json ./
COPY package*.json ./
# README: Why --ignore-scripts? https://github.com/typicode/husky/issues/920#issuecomment-809851650
RUN npm ci --include="dev" --ignore-scripts
COPY apps/backend/healthcheck.js .
COPY apps/backend ./apps/backend
COPY packages ./packages
RUN npx nx build backend

FROM docker.io/node:20.10.0-alpine
RUN addgroup --system backend && \
    adduser --system -G backend backend
WORKDIR /app
COPY --chown=backend:backend --from=build_stage /build/node_modules ./node_modules
COPY --chown=backend:backend --from=build_stage /build/healthcheck.js ./
COPY --chown=backend:backend --from=build_stage /build/package*.json ./
# RUN npm prune --omit=dev
COPY --chown=backend:backend --from=build_stage /build/dist/apps/backend ./dist/apps/backend
COPY --chown=backend:backend --from=build_stage /build/dist/packages ./dist/packages

EXPOSE 3001

CMD [ "node", "dist/apps/backend/main.js" ]