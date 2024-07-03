# Docker Basic Commands

## Pull image

เราจะ pull **Nginx** image มารันบนเครื่องของเรากัน

ไปค้นหา image ได้ที่

[docker hub](https://hub.docker.com)

ตัวอย่าง

![nginx in dockerhub](/four.png)

ใช้คำสั่งนี้

```sh
docker pull nginx
```

## List images

list docker image ออกมาดูว่าเรามี images อะไรบ้าง

```sh
docker image ls
```

หรือจะใช้คำสั่งนี้ก็ได้

```sh
docker images
```

## Delete image

ลบ image ก็สั่ง

```sh
docker image rm <image id | image name>:<tag>
```

```sh
docker image rm nginx:latest
```

หรือจะใช้คำสั่งนี้ก็ได้

```sh
docker rmi <image id | image name>:<tag>
```

## Create container from image

สร้าง container จาก image ที่ pull มา

```sh
docker run <Image Id | image name>:<tag>
```

::: info NOTE
ถ้าเราสั่ง run container แต่ยังไม่ได้ pull image มันก็จะพยายาม pull ให้เองเลย
:::

เช่น

```sh
docker run nginx:latest
```

## List containers

ดูว่าตอนนี้มี container อะไรทำงานอยู่บ้าง ตอนนี้ให้เปิด Terminal อีกหน้านึงแล้วสั่ง

```sh
docker container ls
```

หรือจะเป็นอีกคำสั่งคือ

```sh
docker ps
```

จะเห็นว่าคำสั่งที่เราใช้ `docker run` จะทำให้ terminal มันรัน docker container อยู่ และเราไม่สามารถทำอะไรกับมันได้
ถ้าเรากด `ctrl + c` เพื่อหยุดการทำงานของ container ตัว container นั้นก็จะหยุดการทำงานไปเลย

ทีนี้ลองเช็ค container ที่ทำงานอยู่อีกรอบ

```sh
docker container ls
```

จะเห็นว่าไม่มี container อยู่แล้ว

แต่จริงๆแล้ว container มันไม่ได้หายไปไหน มันแค่หยุดการทำงานไป
เราสามารถ list container ทั้งหมดออกมาได้ โดยจะได้ container ที่กำลังทำงานอยู่และที่หยุดทำงานไปแล้ว ด้วยคำสั่ง

สามารถดูได้ด้วยคำสั่งนี้

```bash
docker container ls -a
```

### detach

ถ้าไม่อยากให้ terminal มันค้างไป เราต้องใช้ detach

```sh
docker run -d nginx:latest
```

## Start the stopped container

```sh
docker start <container id | container name>
```

## Naming the container

จะเห็นว่า container ที่ได้มานั้นมันมีชื่ออยู่ แต่ชื่อที่จะได้จะเป็นชื่อแบบสุ่ม ซึ่งถ้าเราไม่ระบุมันก็จะสุ่มมาให้แหละ

```bash
docker run -d --names <new name> <Image ID | Image Name>:<tag>
```

เช่น

```bash
docker run -d --name my-nginx nginx
```

## Stop container

หยุด container ที่ทำงานอยู่

```bash
docker stop <Container Name | Container ID>
```

```bash
docker stop my-nginx
```

## Delete the stopped container

ลบ container ที่หยุดทำงานไปแล้วด้วยคำสั่งนี้

```bash
docker rm <Container Name | Container ID>
```

เช่น

```bash
docker rm my-nginx
```

## Delete the running container

ถ้าสั่ง `docker rm` มันจะไม่ยอมลบให้ เพราะ container มันทำงานอยู่

ถ้าเรามั่นใจว่าลบได้ ก็ให้ใช้ `-f` ได้เลย

```bash
docker rm -f <Container Name | Container ID>
```

เช่น

```bash
docker rm --force <Container Name | Container ID>
```

## Exposing port

เนื่องจากว่า container ก็เป็นเหมือน computer เครื่องหนึ่ง ถ้ามี service อะไรสักอย่างทำงานอยู่ แล้วเราอยากเข้าถึง ก็จะต้องเข้าถึงผ่าน port ซึ่ง port นั้นจะต้องเปิดอยู่ด้วย เช่น Nginx นั้นเปิด port 80 ให้เราเข้าถึงได้

![exposing port](/5.png)

เราจะเปิด port ที่ container แล้วส่งข้อมูลมาที่เครื่อง host ผ่าน port ของเครื่อง host อีกที
เรียกว่าการ binding port ด้วยคำสั่งนี้

```bash
docker run -d --name my-nginx -p <host-port>:<container port> <Image Name>:<tag>
```

```bash
docker run -d --name my-nginx -p 8080:80 nginx
```

ลองเปิด browser ดูที่ port 8080

![port 8080](/6.png)

```
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                                   NAMES
7ae54dc5459b   nginx     "/docker-entrypoint.…"   5 seconds ago   Up 4 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp   my-nginx
```

เมื่อ `docker ps` ดูก็จะเห็นว่ามี port แสดงให้ดูด้วย

## Exposing Multiport

สามารถเปิด binding ports หลายๆ ports ได้ด้วยนะ

```bash
docker run -d --name my-nginx -p 3000:80 -p 8080:80 nginx
```

## Docker Execute then container

เราสามารถ remote เข้าไปใน container ได้วย เผื่อว่าอยากจะเข้าไปดูหรือใช้คำสั่งอะไร
เราสามารถ sh เข้าไปใน container ได้ด้วยคำสั่ง

```bash
docker exec -it <container name | container id> bash
```

```bash
docker exec -it <container name | container id> /bin/sh
```

## Inspect container

เราสามารถดูรายละเอียดของ container ได้ด้วยคำสั่ง

```bash
docker container inspect <container name | container id>
```

```bash
docker container inspect my-nginx
```
