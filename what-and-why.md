# What & Why?

## What is Docker?

- เป็น VM รูปแบบหนึ่งที่จำลอง computer ใน computer เหมือนกับ VM อื่นเช่น VirtualBox, Parallel แต่ Docker จะมีขนาดที่เล็กกว่ามากๆ การติดตั้งง่ายกว่า VM อื่นๆมากๆ
- เป็น tools ตัวหนึ่งที่ใช้ run แอพต่างๆ ที่มี environment ต่างกัน
- docker ก็เป็น Virtual Machine แบบหนึ่ง
- แอพที่เขียนขึ้นมาจะรันใน environment เดิมเสมอ
- แต่ละแอพจะรันใน environment ของตัวเองและแยกขาดจากแอพอื่นๆอย่างชัดเจน
- docker มี standard ทำให้การ deploy software ทำได้ง่าย
- setup server
- security

## Deployment

### Bare metal

![bare metal](/1.png)

### Docker

![using docker](/2.png)

::: info
การที่เราจะ deploy app ด้วย docker เราก็ต้องสร้าง Dockerfile เพิ่มเข้ามา
แต่ถ้าจะ deploy app ด้วยวิธีการแบบเก่าก็ทำได้เลยเหมือนเดิมได้เลย
:::

### Kubernetes

![k8s](/3.png)

## Portability

เนื่องจากว่า VM จะมี OS แยกกันต่างหากอย่างชัดเจนเลย การที่จะก๊อปปี้ OS+แอพ ทั้งก้อนไปใส่เครื่องอื่นๆมันทำได้แต่มันจะยากกว่ากันมากๆ

ส่วน docker จะทำการ pack แอพของเราลงใน image ซึ่ง docker มัน lightweight อยู่แล้ว เราสามารถเอา image ไปรันบนเครื่องที่ติดตั้ง docker ได้เลย

## Security

Docker engine จะรันบน OS หลักอีกทีหนึ่ง ซึ่งถ้า OS หลักโดนเจาะแล้วเข้าถึง root user ได้ จะทำให้ hacker คนนั้นสามารถควบคุมแอพของเราที่รันบน docker ได้ทั้งหมดเลย hacker สามารถ copy DB ออกไปได้

Virtual Machine ก็จะคล้ายๆกันถ้าโดนเจาะที่ OS หลักก็มีปัญหาเดียวกับ docker อะแหละ แต่ VM จะมี OS เป็นของตัวเองเวลาทำงานก็จะ boot OS ของตัวเองขึ้นมารันบน OS หลักอีกทีหนึ่ง ซึ่งถ้าหาก hacker ต้องการ copy DB ก็จะต้องเจาะ OS ของ VM อีกชั้นหนึ่ง (แต่ไม่เสมอไปนะ อันนี้อยู่ที่การ setup VM ด้วย)

## Performance

VM จะใช้ทรัพยากรของเครื่องมากกว่า docker เพราะว่า VM จะต้องมีการ boot OS ก่อนที่จะรันแอพได้ แต่ docker มันมีขนาดเล็กกว่า VM มากๆ การที่จะรัน container ใช้เวลาน้อยมากๆ

การ scaling up ของ docker เองก็ทำได้ง่ายกว่า เพราะว่าเราแค่ใช้ image ตัวเดิม นำเอามารันเป็น container เพิ่มอีกตัวหนึ่งได้เลย แต่สำหรับ VM นั้นเราจะต้องติดตั้ง OS ก่อน จากนั้นก็เอา binary ของแอพไปลง แล้วสั่งรัน แค่ติดตั้ง OS เพิ่มอีกตัวหนึ่งก็ลำบากแล้ว

## Scaling

เนื่องจากว่า app ของเราถูก pack เป็น docker image แล้ว
มันง่ายมากๆ ที่จะ start มันขึ้นมาอีกหลายๆตัว ไม่ต้องไป download source code แล้วก็ต้อง build แล้วก็ start app

## app crashed

ถ้าเกิดว่า app ของเราค้าง รับ request ไม่ได้แล้วต้องการ restart app ละ docker สามารถ handle ส่วนนี้ได้ง่ายๆเลย

## Compare

| **topic**           | **Virtual Machine**                                                       | **Docker**                                                                    |
| ------------------- | :------------------------------------------------------------------------ | :---------------------------------------------------------------------------- |
| **Boot-Time**       | ขึ้นอยู่กับว่า OS ตัวที่ติดตั้่งมันใช้เวลา boot นานแค่ไหน                 | Boot ได้ในไม่กี่วินาที                                                        |
| **Runs on**         | จะรันบน Hypervisor                                                        | รันบน Docker engine                                                           |
| **isolation**       | Hardware level process isolation                                          | OS Level process isolation                                                    |
| **Require storage** | หลาย GB เลยแค่ลำพัง OS ก็หลาย GB แล้ว                                     | Container มัน lightweight มากๆ ขนาดก็มีตั้งแต่ KB -> GB แล้วแต่แอพของเรา      |
| **VM Template**     | VM นั้นหายากมากๆที่จะมีคนทำ VM เพื่อที่จะเอาไว้รัน NodeJS, JVM, MySQL etc | docker นั้นมี image ที่พร้อมสำหรับการรัน NodeJS, JVM, MySQL etc. อยู่เยอะมากๆ |
| **setup**           | การสร้าง VM เพื่อเอามาใช้รันแอพต้องใช้เวลา setup นานมากๆ                  | แค่ติดตั้ง docker engine                                                      |
| **resource usage**  | ใช้ resource มากกว่า                                                      | ใช้น้อยกว่า                                                                   |
