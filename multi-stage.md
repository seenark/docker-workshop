# Multi-stage Dockerfile for React + Vite + TS

## Problems

เราได้ build react เรียบร้อย มี docker image แล้ว
สามารถรัน docker image เป็น docker container ได้แล้ว

เราจะมาลอง sh เข้าไปดูภายใน container กัน

รันก่อน

```sh {1}
❯ docker run -p 3001:3001 --name react -d react
7fbf3951b9f39f9ff72695bc1f9e48d14575bae4bee7434054ccb6cce9792b38
```

แล้วสั่ง `exec` เข้าไปที่ container

```sh
docker exec -it react /bin/bash
```

แล้วสั่ง `ls -al` เพื่อดูรายการไฟล์ที่มี

```sh
❯ docker exec -it react /bin/bash
root@7fbf3951b9f3:/app# ls -al
total 156
drwxr-xr-x 1 root root    32 Jun 30 05:15 .
drwxr-xr-x 1 root root    14 Jun 30 05:27 ..
drwxr-xr-x 1 root root    66 Jun 30 05:15 .direnv
-rw-r--r-- 1 root root   253 Jun 30 05:12 .dockerignore
-rw-r--r-- 1 root root    13 Jun 30 03:25 .envrc
-rw-r--r-- 1 root root   436 Jun 30 03:25 .eslintrc.cjs
-rw-r--r-- 1 root root   253 Jun 30 03:25 .gitignore
-rw-r--r-- 1 root root   221 Jun 30 04:43 Dockerfile
-rw-r--r-- 1 root root  1300 Jun 30 03:25 README.md
-rwxrwxrwx 1 root root 94823 Jun 30 03:33 bun.lockb
drwxr-xr-x 1 root root    48 Jun 30 05:15 dist # [!code ++]
-rw-r--r-- 1 root root  1058 Jun 30 03:25 flake.lock
-rw-r--r-- 1 root root  1249 Jun 30 03:25 flake.nix
-rw-r--r-- 1 root root   138 Jun 30 03:25 global.d.ts
-rw-r--r-- 1 root root   366 Jun 30 03:25 index.html
drwxr-xr-x 1 root root     8 Jun 30 05:15 node_modules
-rw-r--r-- 1 root root   743 Jun 30 03:25 package.json
drwxr-xr-x 1 root root    16 Jun 30 03:25 public # [!code ++]
drwxr-xr-x 1 root root   100 Jun 30 03:25 src
-rw-r--r-- 1 root root   677 Jun 30 03:25 tsconfig.app.json
-rw-r--r-- 1 root root   139 Jun 30 03:25 tsconfig.json
-rw-r--r-- 1 root root   325 Jun 30 03:25 tsconfig.node.json
-rw-r--r-- 1 root root   163 Jun 30 03:25 vite.config.ts
```

จะเห็นว่ามี ไฟล์ที่เราไม่ได้ใช้ใน production เต็มไปหมดเลย
ไฟล์ที่เกินมาเหล่านี้ทำให้ docker image ของเรามีขนาดใหญ่ด้วย

เราจะแก้ปัญหานี้ด้วยการทำ Multi-stage นั่นเอง

## Multi-stage Dockerfile

มาดูตัวอย่างกันเลย

<<< @/snippets/react/v2/Dockerfile

จากตัวอย่างจะแบ่งเป็น 2 stages

1. build
2. final

### 1. Build stage

- `FROM oven/bun:alpine as build` อันนี้คือเปลี่ยนมาใช้ bun image ที่มีขนาดเล็กลง ถ้าจะให้เล็กกว่านี้ก็ต้องใช้ distroless ละ
  ส่วน `as build` คือกำหนดชื่อของ stage นี้ ให้ชื่อว่า `build`

  ส่วนนี้จะจบแค่ `RUN bun run build`
  สุดท้ายเราจะได้ folder `dist` มา
  และจบ stage แค่นี้เลย

### 2. Final stage

ที่ stage นี้เราจะ copy file ที่จำเป็นในการรัน React app มาใช้

- `COPY --from=build /app/dist ./dist` จะเห็นว่ามีการเพิ่ม flag `--from` มาด้วย เป็นการบอกว่าจะให้ copy file จาก stage `build` มาใช้ที่ stage นี้
  ซึ่งจะไป copy ที่ `/app/dist` ก็คือไปที่ WORKDIR ใน stage build แล้ว copy folder `dist` มาไว้ที่ `./` สุดท้ายเราจะได้ `./dist` เหมือนเดิม

## build docker image

```sh
docker build -t react .
```

```sh
❯ docker build -t react .
[+] Building 7.1s (16/16) FINISHED              docker:orbstack
 => [internal] load build definition from Dockerfile       0.1s
 => => transferring dockerfile: 394B                       0.0s
 => [internal] load metadata for docker.io/oven/bun:alpin  2.0s
 => [auth] oven/bun:pull token for registry-1.docker.io    0.0s
 => [internal] load .dockerignore                          0.1s
 => => transferring context: 295B                          0.0s
 => [internal] load build context                          0.0s
 => => transferring context: 1.39kB                        0.0s
 => [build 1/7] FROM docker.io/oven/bun:alpine@sha256:fb5  0.0s
 => CACHED [build 2/7] WORKDIR /app                        0.0s
 => CACHED [build 3/7] COPY package.json .                 0.0s
 => CACHED [build 4/7] COPY bun.lockb .                    0.0s
 => CACHED [build 5/7] RUN bun install                     0.0s
 => [build 6/7] COPY . .                                   0.2s
 => [build 7/7] RUN bun run build                          1.7s
 => CACHED [stage-1 3/5] COPY --from=build /app/dist ./di  0.0s
 => [stage-1 4/5] COPY ./public ./public                   0.1s
 => [stage-1 5/5] RUN bun install --global serve           2.4s
 => exporting to image                                     0.2s
 => => exporting layers                                    0.1s
 => => writing image sha256:d5ac5bab7d45f1b1fa5a74d44adb9  0.0s
 => => naming to docker.io/library/react                   0.0s
```

## Run container

```sh
docker run -p 3001:3001 --name react -d react
```

```sh
❯ docker run -p 3001:3001 --name react -d react
1a2731d0fcc7bf4dbb41956577c6db0b3874f55582091b60e4f380e210e72aaa
```

## Exec

ลอง sh เข้ามาดูก็จะเห็นว่า มี ไฟล์นิดเดียว เท่าที่จำเป็นต้องใช้

```sh
docker exec -it react /bin/sh
```

```sh
❯ docker exec -it react /bin/sh
/app # ls
dist    public
/app # ls -al
total 0
drwxr-xr-x    1 root     root            12 Jun 30 07:53 .
drwxr-xr-x    1 root     root            14 Jun 30 07:55 ..
drwxr-xr-x    1 root     root            48 Jun 30 07:46 dist # [!code ++]
drwxr-xr-x    1 root     root            16 Jun 30 03:25 public # [!code ++]
```
