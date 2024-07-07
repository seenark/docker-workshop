# Docker concepts

มาดู concepts ของ Docker กันก่อน

![27](/27.gif)

## Docker architecture

![docker architecure diagram](https://docs.docker.com/guides/images/docker-architecture.webp)

## Docker object

![docker objects](https://miro.medium.com/v2/resize:fit:1079/1*3ds-PdxGGMN-ZzJH95_lsA.png)

### Dockerfile

เป็น declarative file ที่เขียนรายละเอียด กำหนดว่าเราจะ build docker image ขึ้นมามีขั้นตอนอะไรบ้าง

### images

docker image เป็นเหมือนกับ template ที่เอาไว้สร้าง docker container
ซึ่งปกติแล้ว docker image ก็จะสร้างมาจาก docker image อีกทีหนึ่ง แล้วเราก็เพิ่มการ custom อะไรบางอย่างลงไป กลายเป็น image ตัวใหม่
ยกตัวอย่างเช่น เราไปเอา docker image ของ ubuntu มา แล้วเราก็ใส่ mysql ลงไป ใส่ nodejs ลงไป ใส่ frontend ลงไป กลายเป็น image ตัวใหม่ ซึ่งพอเอาไปใช้สร้างเป็น docker container แล้ว container นั้นก็จะมี mysql, nodejs, frontend พร้อมใช้งานเลยทันที

image 1 ตัวสามารถสร้างเป็น container จำนวนเท่าไรก็ได้ และ container เหล่านั้นก็จะทำงานเหมือนกันหมดเลย

### containers

container เกิดจากการเอา image มารันบน docker engine มันก็เหมือนเป็น computer เครื่องนึงที่มีขนาดเล็ก
container จะทำงานแยกอิสระต่อกัน แต่ก็สามารถเอามาเชื่อมต่อกันผ่าน network ภายในที่สร้าง โดย docker engine ได้

## Docker daemon (container runtime)

เป็น runtime ที่จะคอยรับคำสั่งจาก docker api
เช่นเมื่อเราสั่งให้สร้าง container เราก็จะพิมพ์คำสั่งผ่าน cli ซึ่งคำสั่งเหล่านี้แหละ จะวิ่งไปที่ **dockerd** แล้ว dockerd ก็จะสร้าง container ให้เรา

## Docker client

ก็คือเครื่องที่ run docker cli นั่นแหละ หรือก็คือเครื่องคอมของเรานั่นแหละ
โดยส่วนมากเราจะคุ้นเคยกับการที่บนเครื่องติดตั้ง docker แล้วก็สามารถรันคำสั่งต่างๆ แล้วก็ได้ container มาเลย ซึ่งจริงๆแล้ว บนเครื่องนั้นเป็นทั้ง **dockerd** และ **docker client** อยู่บนเครื่องเดียวกัน
และมันไม่จำเป็นต้องอยู่บนเครื่องเดียวกันก็ได้

## Docker registry

เป็น Database ที่เอาไว้เก็บ docker image
cloud registry ที่ให้บริการก็มีหลายเจ้า เช่น

- **dockerhub** 👈
- qauy.io (redhat)
- **google cloud registry** 👈
- amazon
- azure
- gitlab registry
- **ghcr (github container registry)**
- selfhost
