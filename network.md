# Docker network

## Problems

จากข้อก่อนหน้า เราเอา Nextjs เรียกผ่าน host.docker.internal
ซึ่งมันต้องเรียก data ย้อนออกมาที่เครื่อง host ก่อนแล้วย้อนกลับเข้าไปที่ backend

ถ้าเราใช้ network เราจะทำให้ nextjs สามารถเรียกไปที่ backend ได้ตรงๆเลย

## Knowing Docker Network

มาทำความรู้จักกับ network command กันก่อน

```sh
docker network ls
```

```sh
❯ docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
62490c6249ac   bridge    bridge    local
f995a98564a2   host      host      local
13fa6f2ef770   none      null      local
```

จะเห็นว่ามี network อยู่ 3 ตัว
networks เหล่านี้จะเป็นเหมือนวงแลนวงนึง ใครเชื่อมต่อเข้ามาที่วงแล้วนี้ก็จะมองเห็นกันเหมือนที่เครื่องคอมอยู่ในวงแลนเดียวกัน

1. null -> container ไหนเชื่อมมาที่ none จะไม่ถูกเข้าถึงจากภายนอกได้เลย
2. host -> ก็คือเครื่องเรานี่แหละ network เส้นนี้จะเชื่อมต่อกับ host นี่แหละ ในหนึ่งเครื่องจะมี host ได้แค่อันเดียว
3. bride เป็นวงแลนเส้นนึง

## Create Network

เราสามารถสร้าง network ได้ด้วย ซึ่งจะมี driver เป็น bridge ได้เท่านั้นนะ

จากตัวอย่างของเราก่อนหน้า
เราก็จะเอา Next มาต่อเข้าที่ network ที่ชื่อว่า **my_bridge1**
แล้วก็เอา Backend มาต่อเข้าที่ network ที่ชื่อว่า **my_bridge1** เช่นกัน

![network1 image](/network1.gif)

เราจะสร้าง network ใน docker ด้วยคำสั่ง

```sh
docker network create my_bridge1
```

```sh
❯ docker network ls
NETWORK ID     NAME         DRIVER    SCOPE
62490c6249ac   bridge       bridge    local
f995a98564a2   host         host      local
22fb86b854db   my_bridge1   bridge    local # [!code ++]
13fa6f2ef770   none         null      local
```

## Connect container to network

### connect when run container

```sh
docker run --name next -p 3000:3000 --network my_bridge1 -d next
```

ตรวจสอบว่า network มี container อะไร connect อยู่บ้างด้วยคำสั่ง

```sh
docker inspect <network name>
```

```sh {29}
❯ docker inspect my_bridge1
[
    {
        "Name": "my_bridge1",
        "Id": "22fb86b854db4e238e58c34f5a2f172840f8cdc0d35fe2e0c7aa5868dd4f1004",
        "Created": "2024-07-01T20:18:10.448458201+07:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "192.168.228.0/24",
                    "Gateway": "192.168.228.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "39324b32c57efd54ebc1f779ec804ab5e3940550f729d3bf1dda3c43a6c2ed0d": {
                "Name": "next",
                "EndpointID": "e1111b7573e1dce638ff18bb3ccb4374cae2b5d754a30bcd13d0521c6383f896",
                "MacAddress": "02:42:c0:a8:e4:02",
                "IPv4Address": "192.168.228.2/24",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

จะเห็นว่ามี **next** อยู่ในนั้นแล้ว

เหลือ Backend อีกตัวนึง

รอบนี้เราจะ start backend ก่อน
แล้วเราจะ connect container เข้าไปที่ network ภายหลัง

```sh
docker run --name hono -p 3333:3333 -v ./uploads:/app/uploads -d hono
```

connect backend to network

```sh
docker network connect <network name> <container name>
```

```sh
docker network connect my_bridge1 hono
```

แล้ว inspect network ดูอีกครั้งหนึง

```sh {35-41}
❯ docker inspect my_bridge1
[
    {
        "Name": "my_bridge1",
        "Id": "22fb86b854db4e238e58c34f5a2f172840f8cdc0d35fe2e0c7aa5868dd4f1004",
        "Created": "2024-07-01T20:18:10.448458201+07:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "192.168.228.0/24",
                    "Gateway": "192.168.228.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "39324b32c57efd54ebc1f779ec804ab5e3940550f729d3bf1dda3c43a6c2ed0d": {
                "Name": "next",
                "EndpointID": "e1111b7573e1dce638ff18bb3ccb4374cae2b5d754a30bcd13d0521c6383f896",
                "MacAddress": "02:42:c0:a8:e4:02",
                "IPv4Address": "192.168.228.2/24",
                "IPv6Address": ""
            },
            "5fd7e837549bee5ba7d1f581c897bcd06f9ff3791ed030bd06c05bf5f1d2f1c9": {
                "Name": "hono",
                "EndpointID": "940da611fb052999b73cdef031c2ab8c7f083b7ad7e314a4e65774e0c55189d3",
                "MacAddress": "02:42:c0:a8:e4:03",
                "IPv4Address": "192.168.228.3/24",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

เหลือแค่มาแก้ next app ของเราให้เรียกไปที่ backend ผ่าน network

ให้ใส่ชื่อของ container ลงไปตรงๆเลย
ถ้าอยู่ใน network เดียวกัน docker จะพาไปที่ container นั้นได้ถูกต้องเองเลย

```ts
fetch("http://hono:3333/users").then(
  (res) => res.json() as Promise<{ users: { name: string; age: number }[] }>,
);
```

ก็ให้ build image ใหม่อีกรอบนึง แล้ว run ต่อไปเลยนะ

```sh
docker build -t next .
docker run --name next -p 3000:3000 --network my_bridge1 -d next
```

ลองเปิด browser ดูจะต้องไม่ error นะ

http://localhost:3000/

สุดท้ายก็จะได้ภาพแบบนี้
![netowrk2 image](/network2.gif)
