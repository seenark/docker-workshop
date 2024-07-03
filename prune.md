# Prune

เมื่อเราใช้งานไปนานๆ อาจจะมี image บางตัวที่ไม่ได้ใช้แล้ว มันก็จะกินพื้นที่ HDD อยู่อะนะ
เราสามารถ clear พื้นที่ HDD ของเราได้

คำสั่ง prune ก็ใช้อย่างระมัดระวังด้วยนะ

## Prune image

```sh
docker image prune -af
```

## Prune container

```sh
docker container prune -af
```

## Prune Volume

```bash
docker volume prune -a -f
```

## Prune Network

```bash
docker network prune -a -f
```

## Prune System

system นี่คือทุกอย่างเลย ทั้ง images, volumes, containers, networks

```bash
docker system prune -a
```
