# Hands-on SSR using Next

## Installation

```sh
pnpx create-next-app@latest
```

```sh
❯ pnpx create-next-app@latest
Packages: +1
+
Progress: resolved 1, reused 0, downloaded 1, added 1, done
✔ What is your project named? … next
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like to use `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the default import alias (@/*)? … No / Yes
Creating a new Next.js app in /Users/atiwatseenark/Desktop/next/next.

Using pnpm.

Initializing project with template: app-tw


Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- postcss
- tailwindcss
- eslint
- eslint-config-next
```

files และ folders ที่ได้

```sh
.
├── flake.lock
├── flake.nix
├── global.d.ts
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│  ├── next.svg
│  └── vercel.svg
├── README.md
├── src
│  └── app
├── tailwind.config.ts
└── tsconfig.json

```

## edit home page

เราจะเรียก GET `/users` จาก api ที่ทำไว้

```tsx
const getUsers = () =>
  fetch("http://localhost:3333/users").then(
    (res) => res.json() as Promise<{ users: { name: string; age: number }[] }>,
  );

export default async function Home() {
  const users = await getUsers();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ul>
        {users.users.map((usr) => (
          <li key={usr.name}>
            <p>name: {usr.name}</p>
            <p>age: {usr.age}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export const dynamic = "force-dynamic";
```

จะเห็นว่าใส่ `export const dynamic = "force-dynamic"` เพื่อบังคับให้เป็น SSR แทนที่จะเป็น SSG

## Dockerfile

ใน Nextjs ง่ายมากๆ เขาทำมาให้หมดแล้วดีแล้วด้วย

ไป copy ได้ที่ [link](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile) นี้

แต่ก่อนจะไป copy เราจะต้องแก้ `next.config.js` ก่อน

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // [!code ++]
};

export default nextConfig;
```

ให้เรารัน `docker init` ก่อน

```sh
docker init
```

แล้วก็ copy Dockerfile จาก link ที่ให้ไป มาวางทับได้เลย

<<< @/snippets/next/v1/Dockerfile

## Build docker image for Nextjs

```sh
docker build -t next .
```

## Run container

```sh
docker run --name next -p 3000:3000 -d next
```

แต่เมื่อเราเปิดไปที่หน้าเวป มันจะ Error

![next1 image](/next1.png)

เราจะต้องเข้าไปดู log

## Docker log

อยากให้ focus กับวิธีการดู log ที่จะเกิดขึ้นใน container ก่อนนะ

```sh
docker container logs next
```

```sh
❯ docker container logs next
  ▲ Next.js 14.2.4
  - Local:        http://localhost:3000
  - Network:      http://0.0.0.0:3000

 ✓ Starting...
 ✓ Ready in 37ms
TypeError: fetch failed
    at node:internal/deps/undici/undici:12618:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async o (/app/.next/server/app/page.js:6:29101) {
  cause: Error: connect ECONNREFUSED ::1:3333
      at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1555:16)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:128:17) {
    errno: -111,
    code: 'ECONNREFUSED',
    syscall: 'connect',
    address: '::1',
    port: 3333
  },
  digest: '3571952263'
}
TypeError: fetch failed
    at node:internal/deps/undici/undici:12618:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async o (/app/.next/server/app/page.js:6:29101) {
  cause: Error: connect ECONNREFUSED ::1:3333
      at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1555:16)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:128:17) {
    errno: -111,
    code: 'ECONNREFUSED',
    syscall: 'connect',
    address: '::1',
    port: 3333
  },
  digest: '3571952263'
}
```

เราจะเห็น log ที่เกิดขึ้นไปก่อนหน้านี้แล้ว เท่านั้น

ถ้าเราอยากดู log ที่เกิดขึ้นมาเรื่อยๆ แบบว่าอยากเฝ้า ก็ให้เพิ่ม flag `-f` มาจาก follow อะนะ

```sh
docker container logs -f next
```

## Solve connection the problems

ทีนี้มาแก้ปัญหากัน
จาก log ที่เจอ บอกเราถึงปัญหาเรื่อง connection
ตัว Next app มันหา backend ของเราไม่เจอ

ทำไมถึงหาไม่เจอ
ต้องมาทำความเข้าใจเรื่อง network กับ container กันก่อน

ตอนนี้เรามี container อยู่ 2 ตัว
และมีการ binding ports ตามภาพนี้

![next2 image](/next2.gif)

จากนั้นเมื่อมี Request จาก User เข้ามา
Nextjs ก็จะเรียกไปที่ http://localhost:3333/users เพื่อขอข้อมูล users มาจากนั้น Nextjs ก็จะเอามา Render ก่อนส่ง html กลับไปให้ user

แต่เนื่องจากว่า url มันเป็น localhost ฉนั้น Nextjs container มันก็เลยไปมองหา port 3333 ภายใน container ตัวเองซึ่งมันไม่มี
ตรงนี้ก็เลยเกิด error ขึ้นมา
เนื่องจากว่า container เป็นเหมือน computer เครื่องหนึ่งการบอกให้ request ไปที่ localhost มันก็เหมือน request วนอยู่ที่เครื่องตัวเอง ก็เลยหาไม่เจอ เพราะว่า backend อยู่ในอีก container หนึ่ง เหมือนกับว่าอยู่ในคอมอีกเครื่องหนึ่งนั่นเอง

![next3 image](/next3.gif)

ฉนั้นการแก้ปัญหาตรงนี้เราจะต้อง request ออกมาด้านนอกที่ HOST:3333 แล้วเอา data ที่ได้ไป render

เราจะต้องเปลี่ยน url ให้เป็น http://host.docker.internal:3333 แทน

![next4 image](/next4.gif)

ก็ แก้ url ตรงนี้
hard code ไปก่อนละกัน ไม่อยากเสียเวลาอธิบายเรื่อง env

```tsx
const getUsers = () =>
  fetch("http://host.docker.internal:3333/users").then(
    (res) => res.json() as Promise<{ users: { name: string; age: number }[] }>,
  );

export default async function Home() {
  const users = await getUsers();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ul>
        {users.users.map((usr) => (
          <li key={usr.name}>
            <p>name: {usr.name}</p>
            <p>age: {usr.age}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export const dynamic = "force-dynamic";
```

ลอง **build** แล้ว **run** อีกครั้งนึง

รอบนี้เปิดหน้าเวปมาจะไม่มี error ละ

![next5 image](/next5.png)
