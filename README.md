# How to start E2E tests

1. Run this command: `npm run compose:dev:up`
2. Now: `npm run test:e2e`

# Connect to dockerized redis

1. `docker exec -it flyver_redis_1 /bin/sh`
2. `redis-cli`
3. `get key-name`

# Connect to dockerized postgres through CLI

1. `docker exec -it container-name bash`
2. `PGPASSWORD="pass" psql -h localhost -p 5432 -U user -d db-name`
3. `SELECT * FROM information_schema.tables;`
4. `UPDATE main.user SET balance=99999999 WHERE mobile LIKE '09109679196';`
