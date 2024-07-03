# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.2.0
ARG PNPM_VERSION=8.15.5

# Build
FROM node:${NODE_VERSION}-alpine AS build # [!code ++]

ENV NODE_ENV production # [!code --]

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
  npm install -g pnpm@${PNPM_VERSION}


WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
  --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build && pnpm prune --prod # [!code ++]

# Final
FROM node:${NODE_VERSION}-alpine AS runner # [!code ++]

ENV NODE_ENV=production
WORKDIR /app

RUN mkdir -p ./uploads # [!code ++]
RUN chown -R node ./uploads # [!code ++]
RUN chmod 700 ./uploads # [!code ++]

COPY --from=build  /app/dist ./dist # [!code ++]
COPY --from=build  /app/node_modules ./node_modules # [!code ++]
COPY --from=build  /app/package.json ./package.json # [!code ++]

USER node

EXPOSE 3333

CMD npm run start # [!code --]
CMD ["node", "dist/index.js"] # [!code ++]

