# Docker compose

## Problem

การที่เราจะต้องมานั่นไล่พิมพ์คำสั่ง docker ไปทีละคำสั่งมันก็คงจะไม่ไหว
ถ้าต้องมี container เยอะๆด้วยแล้ว เหนี่อยแย่เลย
และอาจจะมีโอกาสพิมพ์ผิด setting ค่าผิดได้ง่ายๆเลยด้วย

Docker compose จะมาแก้ปัญหานี้แหละ

## compose.yaml

docker compose จะให้เราเขียนรายระเอียดเกี่ยวกับ container ของเราไว้ในไฟล์เดียวเลย
image อะไร network อะไร binding port อะไรบ้าง ใช้ volume อะไร ระบุไว้ในนี้ได้หมดเลย
สุดท้ายเราจะรันคำสั่งแค่คำสั่งเดียวแล้วเราจะได้ระบบของเรามาแบบง่ายๆเลย

มาเริ่มเขียน compose file กัน

ให้ตั้งชื่อไฟล์ว่า **compose.yaml**

```yaml
# compose.yaml
services:
  next:
    build:
      context: .
    environment:
      NODE_ENV: production
    ports:
      - 3000:3000
```

มาดูกันทีละส่วน

- `services` ต้องมีแน่ๆ บอกว่ามี container อะไรที่จะต้องรันบ้าง
  - `next` อันนี้เป็นชื่อของ service จะใส่เป็นคำว่าอะไรก็ได้ แล้วแต่ชอบ
    - `build` ส่วนนี้บางทีก็เห็นว่าใช้บ้างไม่ใช้บ้าง
      ถ้ามี `build` ตัวนี้นั่นหมายความว่าเราจะไม่ใช้ docker image จากภายนอก เราจะสร้าง docker image ขึ้นมาใช้เอง
      มันคือส่วนที่บอก docker compose ว่าถ้าจะต้องสร้าง docker image ให้ไปมองหา Dockerfile ได้ที่ไหน
      - `context: .` ซึ่งจุด `.` เป็นการบอกว่า Dockerfile ที่ต้องไปมองหามันอยู่ใน folder เดียวกันกับ compose file เลย
    - `environment` คืออยากใส่ ENV อะไรลงไปตอน run container บ้าง ย้ำว่าตอน run นะไม่ใช้ตอนสร้าง image
    - `ports` ก็บอกว่าอยากจะ binding port อะไรบ้าง เป็นตัวเลข ซ้าย คั่นด้วย colon แล้วก็ตัวเลขขวา
      ตัวเลขซ้ายคือ port บน host ตัวเลขขวาคือ port ใน container

## run docker compose

ลองไป run docker compose กัน

ก่อนจะไปรันให้ kill container <span style="color:dodgerblue">next</span> ทิ้งไปก่อน

```sh
docker rm -f next
```

แล้วก็สั่ง

```sh
docker compose up
```

ตรงนี้ docker มันจะไปมองหาไฟล์ที่ชื่อ **compose.yaml** เอง ถ้าเจอมันก็จะเอามาใช้เลย
แต่ถ้าเราตั้งเป็นชื่ออื่นก็ต้องระบุชื่อไฟล์ด้วยนะ

```sh
docker copmose -f <folder/filename> up
```

ก็จะได้ประมาณนี้

```sh
❯ docker compose up
[+] Building 2.9s (22/22) FINISHED              docker:orbstack
 => [next internal] load build definition from Dockerfile  0.0s
 => => transferring dockerfile: 2.25kB                     0.0s
 => [next internal] load metadata for docker.io/library/n  2.3s
 => [next auth] library/node:pull token for registry-1.do  0.0s
 => [next internal] load .dockerignore                     0.1s
 => => transferring context: 672B                          0.0s
 => [next internal] load build context                     0.1s
 => => transferring context: 967B                          0.0s
 => [next base 1/1] FROM docker.io/library/node:18-alpine  0.0s
 => CACHED [next runner 1/8] WORKDIR /app                  0.0s
 => CACHED [next runner 2/8] RUN addgroup --system --gid   0.0s
 => CACHED [next runner 3/8] RUN adduser --system --uid 1  0.0s
 => CACHED [next deps 1/4] RUN apk add --no-cache libc6-c  0.0s
 => CACHED [next deps 2/4] WORKDIR /app                    0.0s
 => CACHED [next deps 3/4] COPY package.json yarn.lock* p  0.0s
 => CACHED [next deps 4/4] RUN   if [ -f yarn.lock ]; the  0.0s
 => CACHED [next builder 2/4] COPY --from=deps /app/node_  0.0s
 => CACHED [next builder 3/4] COPY . .                     0.0s
 => CACHED [next builder 4/4] RUN   if [ -f yarn.lock ];   0.0s
 => CACHED [next runner 4/8] COPY --from=builder /app/pub  0.0s
 => CACHED [next runner 5/8] RUN mkdir .next               0.0s
 => CACHED [next runner 6/8] RUN chown nextjs:nodejs .nex  0.0s
 => CACHED [next runner 7/8] COPY --from=builder --chown=  0.0s
 => CACHED [next runner 8/8] COPY --from=builder --chown=  0.0s
 => [next] exporting to image                              0.1s
 => => exporting layers                                    0.0s
 => => writing image sha256:d66ab9197c2675ae877ecdccf8cec  0.0s
 => => naming to docker.io/library/next-next               0.0s
[+] Running 2/1
 ✔ Network next_default   Create...                        0.1s
 ✔ Container next-next-1  Creat...                         0.1s
Attaching to next-1
next-1  |   ▲ Next.js 14.2.4
next-1  |   - Local:        http://localhost:3000
next-1  |   - Network:      http://0.0.0.0:3000
next-1  |
next-1  |  ✓ Starting...
next-1  |  ✓ Ready in 37ms
```

จะเห็นว่า docker มันไปสร้าง image แล้วก็ Running ต่อเลย
แล้ว terminal เราก็จะค้างไปเลย

ให้ลองเข้า http://localhost:3000 เพื่อดูว่า web ทำงานได้หรือเปล่า

## Docker compose commands

แล้วให้กด <kbd class="kbc-button kbc-button-xs">Ctrl</kbd> + <kbd class="kbc-button kbc-button-xs">c</kbd>
เพื่อออกมา เราจะใช้ terminal ได้ปกติ

แต่ว่า next container ของเราก็จะหยุดไปด้วย

แต่มันไม่ได้ถูกลบไปนะ
ลองเช็คดูได้ด้วยคำสั่ง

```sh
docker container ls -a
```

ถ้าเราอยากจะให้มันกลับมา run อีกครั้ง ต่อจากที่หยุดไปก็สั่ง

```sh
docker compose start
```

จะได้แบบนี้

```sh
❯ docker compose start
[+] Running 1/1
 ✔ Container next-next-1  Start...                         0.3s
```

จะเห็นว่า terminal เราก็ไม่ค้างแล้วด้วย

แต่ถ้าเราอยาก build ใหม่ก็ให้สั่ง stop ก่อน แล้วค่อสั่ง up อีกครั้งหนึ่ง

```sh
docker compose stop
```

```sh
docker compose up --build
```

ใหม่อีกครั้งหนึ่งเท่านั้นเอง

ถ้าอยาก run compose up แล้ว terminal ไม่ค้างให้ใส่ detach ไปด้วยแบบนี้

```sh
docker compose up -d
```

```sh
docker compose up --build -d
```

ถ้าจะลบออกไปเลย ไม่ต้องเก็บ container ไว้แล้ว ให้สั่ง

```sh
docker compose down
```

## Add other services to compose file

```yaml
services:
  next:
    build:
      context: .
    environment:
      NODE_ENV: production
    ports:
      - 3000:3000
  backend: # [!code ++]
    image: hono # [!code ++]
    environment: # [!code ++]
      NODE_ENV: production # [!code ++]
    ports: # [!code ++]
      - 3333:3333 # [!code ++]
```

- `backend` เป็นชื่อจะใส่อะไรก็แล้วแต่ชอบ
- `image` เราจะไม่ build image เอง เราจะไปเอา image ที่มีอยู่แล้วมาใช้ ถ้ามีแล้วในเครื่องก็จะเอามาใช้เลย ถ้าไม่มีก็จะไป pull มา

ก่อนจะไปรัน ให้ไปลบ backend ตัวเก่าออกไปก่อน

```sh
docker rm -f hono
```

แล้วสั่ง

```sh
docker compose up -d
```

```sh
❯ docker compose up -d
[+] Running 2/2
 ✔ Container next-next-1     Ru...                         0.0s
 ✔ Container next-backend-1  Started                       0.3s
```

เราสามารถ list รายการ container ที่รันอยู่โดยเอาเฉพาะ container ที่ระบุใน compose file มาได้ด้วยคำสั่งนี้

```sh
docker ps
```

```sh
❯ docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS          PORTS                                       NAMES
f72294ef8bb2   next-next   "docker-entrypoint.s…"   44 seconds ago   Up 43 seconds   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   next-next-1
45eb8bb4181a   hono        "docker-entrypoint.s…"   44 seconds ago   Up 5 seconds    0.0.0.0:3333->3333/tcp, :::3333->3333/tcp   next-backend-1
```

ตรงนี้ถ้าเปิด http://localhost:3000 จะเจอ error
นั้นก็เพราะว่ามันหา http://hono:3333/users ไม่เจอ

มันหาไม่เจอก็เพราะว่า container ที่ชื่อ hono มันไม่มีแล้ว

docker compose มันจะเอาชื่อ service ไปตั้งเป็นชื่อ container ถ้าเราไม่ได้ระบุชื่อ container name ไว้

การจะแก้ตรงนี้ก็ทำได้ 2 วิธีคือ

1. แก้ชื่อ service ให้เป็น hono ซะ
2. ใส่ชื่อ container name ซะ

ซึ่งผมจะเลือกวิธีที่ 2 ละกัน

```yaml
services:
  next:
    build:
      context: .
    environment:
      NODE_ENV: production
    ports:
      - 3000:3000
  backend:
    container_name: hono # [!code ++]
    image: hono
    environment:
      NODE_ENV: production
    ports:
      - 3333:3333
    volumes:
      - ./uploads:/app/uploads
```

รอบนี้น่าจะเปิด website ได้แล้ว

## compose networks

ใน compose file ถ้ามี services หลายๆตัวอยู่ด้วยกันแล้ว
docker จะจับไว้ใน network วงเดียวกันอยู่แล้ว

ลองไปเช็คดูได้

```sh
docker network ls
```

```sh
❯ docker network ls
NETWORK ID     NAME           DRIVER    SCOPE
62490c6249ac   bridge         bridge    local
f995a98564a2   host           host      local
22fb86b854db   my_bridge1     bridge    local
344de646bf6e   next_default   bridge    local # [!code ++]
13fa6f2ef770   none           null      local
```

ซึ่ง docker compose มันจะสร้าง network อีกวงนึงขึ้นมาน่ะแหละ
เวลาเราสั่ง `docker compose down` มันก็จะลบ network ออกไปให้เอง

แต่ถ้าเราอยากระบุชื่อ network เองก็ทำได้

```sh
networks: # [!code ++]
  my_bridge2: # [!code ++]

services:
  next:
    build:
      context: .
    environment:
      NODE_ENV: production
    ports:
      - 3001:3000
    networks: # [!code ++]
      - my_bridge2 # [!code ++]
  backend:
    container_name: hono
    image: hono
    environment:
      NODE_ENV: production
    ports:
      - 3333:3333
    volumes:
      - ./uploads:/app/uploads
    networks: # [!code ++]
      - my_bridge2 # [!code ++]
```

- `networks` ด้านบนคือบอกว่ามี network อะไรบ้าง
  - `my_bridge2` ชื่อ network ที่เราต้องการจะสร้าง

ส่วนใน services ต่างๆ เราก็ต้องระบุด้วยว่าจะให้เชื่อมต่อไปที่ network ไหนบ้าง

พอสั่ง `docker compose up -d` มันก็จะสร้าง network **my_bridge2** ให้เอง

### use existing network in compose file

ถ้าเราอยากจะให้ compose file ของเรา เชื่อมต่อเข้ากับ networks ที่เคยถูกสร้างมาแล้ว
ก็ให้เขียนแบบนี้

```yaml
networks:
  my_bridge2:
    external: true # [!code ++]
    name: my_bridge1 # [!code ++]

services:
  next:
    build:
      context: .
    environment:
      NODE_ENV: production
    ports:
      - 3001:3000
    networks:
      - my_bridge2
  backend:
    container_name: hono
    image: hono
    environment:
      NODE_ENV: production
    ports:
      - 3333:3333
    volumes:
      - ./uploads:/app/uploads
    networks:
      - my_bridge2
```
