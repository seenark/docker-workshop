FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --global serve && bun install

COPY . .
RUN bun run build


ENV NODE_ENV production
CMD ["bunx","serve","-l","3001", "dist"]

EXPOSE 3001

