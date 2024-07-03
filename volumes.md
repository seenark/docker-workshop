# Volumes

## Problem

จากการทำ Backend ด้วย Hono มาก่อนหน้านี้

![volume1 image](./volume1.gif)

ถ้าหากใครลบ container ทิ้งไป แล้ว start กลับมาอีกรอบ จะเจอว่า ของที่เรา upload ขึ้นไปมันหายไปแล้ว

![volume2 image](./volume2.gif)

นั่นเป็นเพราะว่า ของที่เรา uploaded ขึ้นไปนั้นมันอยู่แค่ภายใน container อย่างเดียว
พอเราลบ container นั้นทิ้ง ก็เหมือนเราลบทุกอย่างไปหมดเลย รวมถึง file ที่เรา uploaded ไปแล้วด้วย

## Docker volumes

เราจะใช้ docker volumes ในการแก้ปัญหานี้

![volume3 image](./volume3.gif)

เมื่อเราลบ container ทิ้งไป
แต่ folder บนเครื่อง host จะยังอยู่

![volume4 image](./volume4.png)

พอเรา start container กลับมาอีกครั้งหนึ่ง เราก็ทำการ binding folder ใน container เข้ากับ folder บน host อีกครั้งหนึ่ง

![volume5 image](./volume5.gif)

## binding volume

```sh
docker run --name hono -p 3333:3333 -v ./uploads:/app/uploads -d hono
```

ทีนี้ลอง upload file เข้ามา

![volume6 image](./volume6.png)

แล้วลองดู folder `/uploads` ก็จะเห็นว่ามี file เพิ่มเข้ามาแล้ว

```sh
.
├── compose.yaml
├── dist
│  └── index.js
├── Dockerfile
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
   └── README.md # [!code ++]
```
