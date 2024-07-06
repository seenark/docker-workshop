# Docker compose restart policy

## Restart policy

ใน docker compose services หาก service ตายไป เราสามารถให้ docker restart ตัวเองกลับมาได้ด้วย

```yaml
networks:
  my_bridge2:
    external: true
    name: my_bridge1

services:
  next:
    build:
      context: .
    environment:
      NODE_ENV: production
    ports:
      - 3001:3000
    restart: unless-stopped # [!code ++]
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
    restart: unless-stopped # [!code ++]
    networks:
      - my_bridge2
```

โดย option ที่ใส่ได้ก็จะมี

- `no` คือไม่ต้อง restart
- `always` จะ restart เสมอ จนกว่ามันจะถูกลบออกไป
- `on-failure[:max number of retries]` จะ restart เมื่อ container ตาย ระบุจำนวนการ restart ได้ด้วย
- `unless-stopped` จะ restart เมื่อ container ตาย แต่ถ้าเรา stop ไว้ มันจะไม่ restart กลับมาเองนะ

## Health check

จากการที่เราใส่ restart policy เข้าไปนั้น มันจะ restart ก็ต่อเมื่อ container มันตายไป หรือได้ exit code มา

การใส่ Health check คือการที่เราบอก docker ถึงวิธีการที่จะทำให้ docker รู้ว่า container เรายังทำงานอยู่ดีไหม
เมื่อ health check failed ก็จะไป restart container ไปตาม restart policy ที่ตั้งไว้

เราสามารถใส่ Health check แบบนี้

```yaml
networks:
  my_bridge2:
    external: true
    name: my_bridge1

services:
  next:
    build:
      context: .
    environment:
      NODE_ENV: production
    ports:
      - 3001:3000
    restart: unless-stopped
    healthcheck: # [!code ++]
      test: ["CMD-SHELL", "curl -f http://localhost:3000 || exit 1"] # [!code ++]
      interval: 1m # [!code ++]
      timeout: 10s # [!code ++]
      retries: 3 # [!code ++]
      start_period: 0s # [!code ++]
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
    restart: unless-stopped # [!code ++]
    healthcheck: # [!code ++]
      test: ["CMD-SHELL", "curl -f http://localhost:3333/healthz || exit 1"] # [!code ++]
      interval: 1m # [!code ++]
      timeout: 10s # [!code ++]
      retries: 3 # [!code ++]
      start_period: 20s # [!code ++]
    networks:
      - my_bridge2
```

จะเห็นว่าเราใช้ curl ในการ check container health

ฉนั้นเราต้องใส่ curl package ลงไปใน container ด้วย

ยกตัวอย่างส่วนของ backend ละกัน

<<<@/snippets/hono/v4/Dockerfile
