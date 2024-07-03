# Portainer

<div style="background-color: white; padding: 8px; border-radius: 15px; margin-top: 20px;">
  <img alt="portainer logo" src="https://www.portainer.io/hubfs/portainer-logo-black.svg" />
</div>

portainer เป็น web based docker dashboard ที่นิยมตัวนึงเลย

ก็เป็น dashboard สำหรับ docker นี่แหละ ใช้ได้ฟรี

[portainer ce](https://docs.portainer.io/)

## installation

ไปดูได้ที่ [link](https://docs.portainer.io/start/install-ce/server/docker/linux)

แต่ว่าเขาจะทำเป็น docker command ธรรมดา

```sh
docker volume create portainer_data
```

```sh
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest
```

แต่ว่าเราสามารถเอามาทำเป็น compose file ได้ด้วย

```yaml
# compose.yaml
services:
  portainer:
    image: portainer/portainer-ce:latest
    ports:
      - 9443:9443
      - 9000:9000
    volumes:
      - ./volumes/portainer/data:/data
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always
```
