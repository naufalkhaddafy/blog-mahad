# Mahad Project

Website Project Mahad (Powered by **FrankenPHP** + **Laravel Octane**).

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be installed and running)

## 🚀 Quick Start (Development)

We have switched to **FrankenPHP** with **Laravel Octane** for high-performance structure and WebSocket support. The development server runs in **watch mode**, so changes are reflected instantly (hot-reload).

### 1. Setup Environment
Copy the example environment file:
```bash
cp .env.example .env
```
Update `.env` configuration for Docker:
```ini
DB_CONNECTION=mysql
DB_HOST=mariadb
DB_PORT=3306
DB_DATABASE=mahad_db
DB_USERNAME=user
DB_PASSWORD=password

# Reverb / WebSocket Config
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

### 2. Run Application
Run the following command to build and start the application.  
It creates 5 services: App (FrankenPHP+Octane), Vite (HMR), Reverb (WebSocket), MariaDB, Redis.

```bash
docker compose -f docker-compose.dev.yaml up --build
```
*Add `-d` to run in the background .*

### Access Ports
- **Website (FrankenPHP)**: [http://localhost:8081](http://localhost:8081)
- **Vite (Hot Reload)**: [http://localhost:5173](http://localhost:5173)
- **Reverb (WebSocket)**: [http://localhost:8080](http://localhost:8080)
- **PhpMyAdmin**: [http://localhost:8082](http://localhost:8082) (Note: Port changed from 8080)
  - User: `root`
  - Password: `root`

---

## 🛠 Useful Commands

**Stop Server:**
```bash
docker compose -f docker-compose.dev.yaml down
```

**Run Artisan Command:**
```bash
docker compose -f docker-compose.dev.yaml run --rm app php artisan <command>
```

**Access Container Shell:**
```bash
docker exec -it blog-mahad sh
```

---

## ❓ Troubleshooting

### 🐢 Slow Performance (Timeout / >60s loading)
If loading takes exactly 60 seconds or feels very slow on Windows:
- This is usually a **DNS Lookup issue** in MariaDB.
- **Fix**: The `docker-compose.dev.yaml` already includes `--skip-name-resolve` for MariaDB. Ensure you have restarted the database container:
  ```bash
  docker compose -f docker-compose.dev.yaml restart mariadb
  ```

### 🔴 Reverb Error "no commands defined in reverb"
If you see this error, the Reverb package might be missing or not installed properly.
- **Fix**: Run the installation command manually:
  ```bash
  docker compose -f docker-compose.dev.yaml run --rm app composer require laravel/reverb
  docker compose -f docker-compose.dev.yaml run --rm app php artisan reverb:install
  ```

### ⚠️ "Unable to determine admin port"
If Octane fails to start with this error:
- **Fix**: Ensure the `command` in `docker-compose.dev.yaml` includes `--admin-port=2019`. The default logic fails when port is 80.
