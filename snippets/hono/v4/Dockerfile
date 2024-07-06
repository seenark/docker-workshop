# Dockerfile
# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.2.0
ARG PNPM_VERSION=8.15.5

# Build
FROM node:${NODE_VERSION}-alpine AS build

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
  npm install -g pnpm@${PNPM_VERSION}


WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
  --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build && pnpm prune --prod

# Final
FROM node:${NODE_VERSION}-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

RUN apk --no-cache add curl # [!code ++]

# add nonroot user and group
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nonroot

# make uploads folder 
RUN mkdir -p ./uploads && chmod 700 ./uploads && chown -R nonroot:nodejs ./uploads

# when copy use flag --chown=<user>:<group>
COPY --from=build --chown=nonroot:nodejs /app/dist ./dist
COPY --from=build --chown=nonroot:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nonroot:nodejs /app/package.json ./package.json

# finally use nonroot user
USER nonroot

EXPOSE 3333

CMD ["node", "dist/index.js"]

