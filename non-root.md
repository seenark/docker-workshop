# Non-root user (Rootless)

## Problem

ใน Linux
root-user จะทำงานได้ทุกอย่างเพราะมีสิทธิ์เป็นเหมือน admin เลย
ใน Docker ก็เหมือนกันเพราะทำ Linux อีกที
ถ้าเกิดว่า Container เราโดนเจาะ แล้ว container นั้นใช้ root user ในการรัน command ต่างๆ ก็เท่ากับว่าคนที่เจาะเข้ามาได้ ได้สิทธิ์ admin ไปเลยในทันที
และ Docker deamon มันทำงานด้วยสิทธิ์ root อยู่แล้วก็มีโอกาสเสี่ยงที่คนเจาะจะออกมาที่ docker daemon ได้แล้วควบคุมเครื่อง Host ได้อีกที

ฉนั้นเราจะป้องกันไว้ก่อนด้วยการเปลี่ยนไปใช้ non-root user แทน
การใช้ non-root user จะทำให้สิทธิ์ในการใช้งาน Container ลดลง เราจะให้ใช้สิทธิ์เท่าที่จำเป็น เป็นการจำกัดสิทธิ์ในการใช้งานไว้

## UID & GID

user ใน Linux จะประกอบไปด้วย 2 ส่วน

1. UID = User ID
2. GID = Group ID

สร้าง group ด้วยคำสั่ง

```sh
addgroup --system --gid 1001 nodejs
```

สร้าง user ด้วยคำสั่ง

```sh
adduser --system --uid 1001 nonroot`
```

## NextJS Dockerfile

<<< @/snippets/next/v2/Dockerfile

จะเห็นว่า Dockerfile ที่ Next เตรียมมาให้แล้วมันใส่ User + Group มาให้ครบแล้ว
ซึ่งเป็นตัวอย่างที่ดีมากๆ ถ้าใครต้องเขียน Dockerfile เอง เอา Dockerfile ของ Next เป็นตัวอย่างได้เลย ดีมากๆ

## Let's update backend's Dockerfile

<<< @/snippets/hono/v3/Dockerfile
