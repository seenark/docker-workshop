# Postgres example

![postgres logo](https://download.logo.wine/logo/PostgreSQL/PostgreSQL-Logo.wine.png)

```yaml
services:
  db:
    image: postgres
    restart: always
    volumes:
      - ./db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_PASSWORD=abcdef
      - POSTGRES_USER=postgres
    ports:
      - 5432:5432
    healthcheck:
      test: ["CMD", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5
```
