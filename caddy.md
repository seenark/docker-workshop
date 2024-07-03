# Caddy

![caddy logo](https://user-images.githubusercontent.com/1128849/210187356-dfb7f1c5-ac2e-43aa-bb23-fc014280ae1f.svg)

Caddy เป็น tools ตัวนึงที่ดีมากๆ
หลักๆผมจะเอามาทำ reverse proxy
แต่ตัว Caddy เองยังทำได้อีกหลายอย่างเลยนะ

หากเราใช้ Caddy ทำ reverse proxy เราจะได้ TLS มาโดยอัตโนมัติเลย และคอย renew certificate ให้ด้วย

## Config caddy via Caddyfile

เราจะต้อง config reverse proxy ผ่าน Caddyfile นะ

```sh
myweb.com {
	reverse_proxy kong:8000
}

# allow http
http://portainer.dev {
	reverse_proxy portainer:9000
}
```

จะเห็นว่าง่ายมากๆ

## compose file

```yaml
version: "3.8"
services:
  caddy:
    image: caddy:2.7.6-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./caddy/site:/srv
      - ./caddy/caddy_data:/data
      - ./caddy/caddy_config:/config
```

## after update config file

เวลาแก้ config เราจะต้องสั่งให้ Caddy load config ใหม่อีกรอบนะ
ก็สั่ง

```sh
docker compose exec -w /etc/caddy caddy caddy reload
```

หรือ compose down แล้ว up ใหม่ก็ได้ แต่ก็จะมี downtime เพิ่มมานะ
