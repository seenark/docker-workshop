# Build
FROM oven/bun:alpine as build

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .

RUN bun run build

# Final
FROM oven/bun:alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY ./public ./public

RUN bun install --global serve

ENV NODE_ENV production

CMD ["bun","x","serve","-l","3001","./dist"]

EXPOSE 3001

