# Mahad Project

Website Project Mahad (Powered by **FrankenPHP** + **Laravel Octane**).

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be installed and running)
- Git

## 🛠 Development Environment

The development setup uses **FrankenPHP** with **Laravel Octane** in watch mode for hot-reloading. Both the backend and frontend (Vite) run in separate containers.

### 1. Initial Setup

Copy the example environment file:
```bash
cp .env.example .env
```

Ensure `.env` matches the Docker configuration:
```ini
DB_CONNECTION=mysql
DB_HOST=mariadb
DB_PORT=3306
DB_DATABASE=mahad_db
DB_USERNAME=user
DB_PASSWORD=password

# Reverb / WebSocket
REVERB_APP_ID=my-app-id
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

### 2. Run Development Server

Start the application (Builds images and starts containers):
```bash
docker compose -f docker-compose.dev.yaml up --build
```
*Add `-d` to run in detached mode (background).*

### 3. Access Points (Development)

- **Website (App)**: [http://localhost:8081](http://localhost:8081)
- **Vite (Assets)**: [http://localhost:5173](http://localhost:5173)
- **Reverb (WebSocket)**: [http://localhost:8080](http://localhost:8080)
- **PhpMyAdmin**: [http://localhost:8082](http://localhost:8082)
    - User: `root`
    - Password: `root`

---

## 🚀 Production Environment

The production setup is optimized for performance, using the `ghcr.io/naufalkhaddafy/blog-mahad:latest` image. It assumes an external database and Redis are available (or configured externally) and uses external networks.

### 1. Prerequisites

Create necessary Docker networks if they don't exist (The production compose file expects these external networks):
```bash
docker network create public_network
docker network create database_network
```

### 2. Setup Configuration

Create the production environment file:
```bash
cp .env.production.example .env.production
```

**Important**: You must update `.env.production` with your actual production credentials (Database, Redis, etc.). The production docker-compose file relies on these variables.

### 3. Run Production Server

Start the production services:
```bash
docker compose -f docker-compose.prod.yaml --env-file .env.production up -d
```

### 4. Services & Ports (Production)

- **App**: Exposed on `127.0.0.1:8001` (Intended to be proxied via Nginx/Caddy/Traefik).
- **Reverb**: Exposed on `8081` (Mapped to internal 8080).
- **Queue & Scheduler**: Run as background services.

---

## 🔧 Useful Commands

**Stop Containers:**
```bash
# Development
docker compose -f docker-compose.dev.yaml down

# Production
docker compose -f docker-compose.prod.yaml --env-file .env.production down
```

**Run Artisan Command (Dev):**
```bash
docker compose -f docker-compose.dev.yaml run --rm app php artisan <command>
```

**Enter Container Shell:**
```bash
docker exec -it blog-mahad sh
```

---

## ❓ Troubleshooting (Dev)

### Fast Refresh / Hot Reload Issues
- Ensure `vite` service is running.
- Check console logs for connection errors to port `5173` or `8080` (Reverb).

### Database Connection
- Ensure `DB_HOST=mariadb` in `.env`.
- If "Connection Refused", try restarting the db service:
  ```bash
  docker compose -f docker-compose.dev.yaml restart mariadb
  ```

### Reverb Connection
- If WebSocket fails, ensure `REVERB_PORT` matches in `.env` and `docker-compose.dev.yaml`.
