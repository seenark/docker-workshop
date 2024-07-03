# Hands-on Backend using Hono

## Installing

::: code-group

```sh [npm]
npm create hono@latest
```

```sh [yarn]
yarn create hono
```

```sh [pnpm]
pnpm create hono@latest
```

```sh [bun]
bun create hono@latest
```

```sh [deno]
deno run -A npm:create-hono@latest
```

:::

ผมก็จะใช้ `pnpm`

```sh
❯ pnpm create hono hono
.../Library/pnpm/store/v3/tmp/dlx-30573  | Progress: resolved 1,.../Library/pnpm/store/v3/tmp/dlx-30573  |   +1 +
.../Library/pnpm/store/v3/tmp/dlx-30573  | Progress: resolved 1,.../Library/pnpm/store/v3/tmp/dlx-30573  | Progress: resolved 1, reused 0, downloaded 1, added 1, done
create-hono version 0.9.2
✔ Using target directory … my-app
? Which template do you want to use? nodejs
✔ Cloning the template
? Do you want to install project dependencies? yes
? Which package manager do you want to use? pnpm
✔ Installing project dependencies
🎉 Copied project files
```

จะได้ files แบบนี้

```sh
.
├── flake.lock
├── flake.nix
├── global.d.ts
├── package.json
├── pnpm-lock.yaml
├── README.md
├── src
│  └── index.ts
└── tsconfig.json`
```

## Start Dev server

```sh
pnpm run dev
```

## Add route

ที่ไฟล์
`src/index.ts`

เพิ่ม route อันนึง

```ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/healthz", (c) => c.text("Ok")); // [!code ++]

const port = 3333;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
```

เปิดใน browser

http://localhost:3333

http://localhost:3333/healthz

## Add upload file routes

เราจะทำ route ที่เอาไว้รับการ upload file จาก frontend
ใน hono ทำได้ง่ายมากๆ ไม่ต้องมี libs อะไรเพิ่มเลย

สร้าง folder `/uploads` มาก่อน

```sh
.
├── flake.lock
├── flake.nix
├── global.d.ts
├── package.json
├── pnpm-lock.yaml
├── README.md
├── src
│  └── index.ts
├── tsconfig.json
└── uploads
```

```ts {3,4,14-27}
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/healthz", (c) => c.text("Ok"));

app.post("/uploads", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file; // string | File
  if (file instanceof File) {
    const folder = "./uploads";
    const fullPath = path.join(folder, file.name);
    const arrBuf = await file.arrayBuffer();
    const buf = Buffer.from(arrBuf);
    writeFile(fullPath, buf);
    return c.text("upload ok");
  }
  c.status(400);
  return c.text("file missing");
});

const port = 3333;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
```

ลองใช้ hoppscotch ทำการ upload file เข้ามา

![upload file](./10.png)

ดูที่ folder จะเห็นว่ามี file เพิ่มมาแล้ว

```sh
.
├── flake.lock
├── flake.nix
├── global.d.ts
├── package.json
├── pnpm-lock.yaml
├── README.md
├── src
│  └── index.ts
├── tsconfig.json
└── uploads
   └── AR3_5771_1-Edit-Edit.jpg # [!code ++]
```

## Serve static file

upload file ได้แล้ว
เราก็ต้องให้คน download กลับไปได้ด้วย

ใน Hono ก็ทำได้ง่ายๆ ไม่ต้องมี lib อะไร

```ts
import { serveStatic } from "@hono/node-server/serve-static";

app.get(
  "/static/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/static/, "/uploads"),
  }),
);
```

การเรียกดู file ที่ uploads เข้ามาจะต้อง GET มาที่ http://localhost:3333/static/file-name

hono server ก็จะวิ่งไปที่ folder `./uploads/file-name`

## Create Dockerfile

เราได้เรียนรู้การสร้าง Dockerfile ด้วยมือไปแล้ว
แต่จริงๆมันง่ายกว่านั้น
Docker เขาเตรียม CLI มาให้เราแล้ว

```sh
docker init
```

แล้วก็ใส่ ข้อมูลไปตามคำถาม

```sh
❯ docker init

Welcome to the Docker Init CLI!

This utility will walk you through creating the following files with sensible defaults for your project:
  - .dockerignore
  - Dockerfile
  - compose.yaml

Let's get started!

? What application platform does your project use? Node
? What version of Node do you want to use? 22.2.0
? Which package manager do you want to use? pnpm
? What version of pnpm do you want to use? 8.15.5
? What command do you want to use to start the app? npm run start
? What port does your server listen on? 3333

CREATED: .dockerignore
CREATED: Dockerfile
CREATED: compose.yaml

✔ Your Docker files are ready!

Take a moment to review them and tailor them to your application.

When you're ready, start your application by running: docker compose up --build

Your application will be available at http://localhost:3333
```

จะเห็นว่ามี files เพิ่มเข้ามาละ

```sh
.
├── .dockerignore # [!code ++]
├── .envrc
├── .gitignore
├── compose.yaml # [!code ++]
├── Dockerfile # [!code ++]
├── flake.lock
├── flake.nix
├── global.d.ts
├── package.json
├── pnpm-lock.yaml
├── README.md
├── src
│  └── index.ts
├── tsconfig.json
└── uploads
   └── AR3_5771_1-Edit-Edit.jpg
```

ข้างในมีอะไรบ้าง ก็ตามนี้

<p style="color: dodgerblue; font-size: 1.5rem; font-weight: 700">.dockerignore</p>

<<< @/snippets/hono/v1/.dockerignore

<p style="color: dodgerblue; font-size: 1.5rem; font-weight: 700">Dockerfile</p>

<<< @/snippets/hono/v1/Dockerfile

<p style="color: dodgerblue; font-size: 1.5rem; font-weight: 700">compose.yaml</p>

<<< @/snippets/hono/v1/compose.yaml

## Build Hono for Node

Hono ไม่ได้เตรียม build script มาให้เรา
เพราะว่ารันไฟล์ TS ตรงๆผ่าน `tsx` เลย
แต่เราจะ build สักหน่อยจะได้ไม่กินแรม

ติดตั้ง lib `typescript` ก่อน

```sh
❯ pnpm add -D typescript
Already up to date
Progress: resolved 33, reused 11, downloaded 0, added 0, done

dependencies:
- typescript ^5.5.2

devDependencies:
+ typescript ^5.5.2

Done in 495ms
```

จากนั้นแก้ `tsconfig.json`

```json
// tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist", // [!code ++]
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  },
  "exclude": ["node_modules"] // [!code ++]
}
```

แล้วก็เพิ่ม build script

```json
// package.json
{
  "name": "hono",
  "type": "module", // [!code ++]
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -b" // [!code ++]
  },
  "dependencies": {
    "@hono/node-server": "^1.11.4",
    "hono": "^4.4.10"
  },
  "devDependencies": {
    "@types/node": "^20.11.17",
    "tsx": "^4.7.1",
    "typescript": "^5.5.2" // [!code ++]
  },
  "packageManager": "pnpm@8.15.5+sha1.a58c038faac410c947dbdb93eb30994037d0fce2"
}
```

## Dockerfile

เราจะมาแก้ Dockerfile กัน

<<< @/snippets/hono/v2/Dockerfile

## Build docker image

```sh
docker build -t hono .
```

```sh
❯ docker build -t hono .
[+] Building 6.7s (22/22) FINISHED              docker:orbstack
 => [internal] load build definition from Dockerfile       0.1s
 => => transferring dockerfile: 916B                       0.0s
 => resolve image config for docker-image://docker.io/doc  2.3s
 => [auth] docker/dockerfile:pull token for registry-1.do  0.0s
 => CACHED docker-image://docker.io/docker/dockerfile:1@s  0.0s
 => [internal] load metadata for docker.io/library/node:2  2.4s
 => [auth] library/node:pull token for registry-1.docker.  0.0s
 => [internal] load .dockerignore                          0.1s
 => => transferring context: 672B                          0.0s
 => [build 1/6] FROM docker.io/library/node:22.2.0-alpine  0.0s
 => [internal] load build context                          0.1s
 => => transferring context: 550B                          0.0s
 => CACHED [runner 2/8] WORKDIR /app                       0.0s
 => [runner 3/8] RUN mkdir -p ./uploads                    0.3s
 => CACHED [build 2/6] RUN --mount=type=cache,target=/roo  0.0s
 => CACHED [build 3/6] WORKDIR /app                        0.0s
 => CACHED [build 4/6] RUN --mount=type=bind,source=packa  0.0s
 => CACHED [build 5/6] COPY . .                            0.0s
 => CACHED [build 6/6] RUN pnpm run build && pnpm prune -  0.0s
 => [runner 4/8] RUN chown -R node ./uploads               0.3s
 => [runner 5/8] RUN chmod 700 ./uploads                   0.3s
 => [runner 6/8] COPY --from=build  /app/dist ./dist       0.1s
 => [runner 7/8] COPY --from=build  /app/node_modules ./n  0.2s
 => [runner 8/8] COPY --from=build  /app/package.json ./p  0.1s
 => exporting to image                                     0.3s
 => => exporting layers                                    0.2s
 => => writing image sha256:05d88658b6d798e9e18fac006f8ee  0.0s
 => => naming to docker.io/library/hono                    0.0s
```

## Run docker container

```sh
docker run -p 3333:3333 --name hono -d hono
```

## Try to upload file

ก็ลอง upload file เล่นๆกันได้

![upload file2](./11.png)

แล้วลองเปิดดูที่ http://localhost:3333/static/file-name

![static file1](./12.png)

## Add one more route

ก่อนจะจบตรงนี้ขอเพิ่ม route อีกอันนึง

```ts
app.get("/users", (c) =>
  c.json(
    // return users
    {
      users: [
        {
          name: "John",
          age: 41,
        },
        {
          name: "Joceph",
          age: 62,
        },
      ],
    },
    200, // status code
  ),
);
```
