# Docker compose restart policy

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
- `on-failure[:max number of retries]` จะ restart เมื่อ container error ระบุจำนวนได้ด้วย
- `unless-stopped` จะ restart เมื่อ container ตาย แต่ถ้าเรา stop ไว้ มันจะไม่ restart กลับมาเองนะ
