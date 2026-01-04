# Modern Server Architecture & Deployment Guide
> **Stack:** Laravel Octane, FrankenPHP, Docker (Multi-Stage), GitHub Actions, Redis, MariaDB (Shared).

This document explains **WHY** and **HOW** we built this infrastructure. Designed for high performance, security, and easy maintenance.

---

## 1. The Architecture (Big Picture)

Instead of a traditional LAMP stack (Linux, Apache, MySQL, PHP) on a single server, we use a **Containerized Microservices** approach.

### The Components
1.  **Shared Infrastructure (The Foundation)**
    *   **Nginx Proxy Manager**: The "Doorman". Handles SSL (HTTPS) and forwards traffic to the right container.
    *   **Shared MariaDB & Redis**: Lives on a dedicated network (`database_network`). Multiple apps can use them (efficient).
2.  **The Application (Your Code)**
    *   **FrankenPHP + Octane**: Unlike normal PHP that dies after every request, this keeps your app loaded in RAM. Super fast.
    *   **Reverb**: WebSocket server for real-time features (Radio/Chat).
    *   **N8N Webhook**: Integration configured via `N8N_WEBHOOK_URL` for external automation.

---

## 2. Docker Strategy (Multi-Stage Build)

We don't just "copy files". We build an artifact.
File: `docker/production/Dockerfile`

### Step 1: Frontend Builder (Node.js)
*   Compiles tailored JS/CSS assets using Vite.
*   **Safety**: API Keys for frontend (`VITE_...`) are baked in here.

### Step 2: Backend Builder (Composer)
*   Installs PHP dependencies.
*   **Optimization**: `--no-dev` ensures testing tools like PHPUnit/Faker are NOT installed in production.

### Step 3: The Final Image (FrankenPHP)
*   A clean Alpine Linux image.
*   We copy **ONLY** the results from Step 1 & 2.
*   **Result**: A small, secure image without source code junk (`node_modules`).

---

## 3. CI/CD Pipeline (GitHub Actions)

We don't SSH to the server to `git pull`. That's slow and risky (downtime).
File: `.github/workflows/deploy.yml`

**The Flow:**
1.  **Push to Main**: You modify code and push.
2.  **GitHub Works**: GitHub serves spins up a VM.
    *   It builds the Docker Image.
    *   It pushes the image to **GitHub Container Registry (GHCR)**.
3.  **Deployment**:
    *   Connects to VPS via SSH.
    *   **Injects Secrets**: Takes the `ENV_FILE` secret from GitHub and writes it to `.env` on the server.
    *   Executes `deploy.sh` to pull the new image and restart services.

---

## 4. Security Practices

### Network Isolation
*   **Public Network**: Only the Web App connects here (to talk to Nginx).
*   **Database Network**: Only the App and DB connect here. The DB has **NO** Internet access.

### Secret Management
*   **Build Secrets**: Stored in GitHub Secrets (injected during build).
*   **Runtime Secrets**: 
    *   Managed in **GitHub Secrets** (Variable: `ENV_FILE`). 
    *   Injected into `.env` on the server during the deployment workflow.
    *   **Note**: The `.env` file is NOT committed to Git.

---

## 5. Cheat Sheet (Commands)

### Development (Local)
```bash
# Start completely fresh
docker compose -f docker-compose.dev.yaml down -v
docker compose -f docker-compose.dev.yaml up --build
```

### Production (Server)
```bash
# Update Application
docker compose -f docker-compose.prod.yaml pull
docker compose -f docker-compose.prod.yaml --env-file .env.production up -d
```

### Debugging Production
```bash
# Check Logs
docker logs -f blog-mahad

# Check Reverb
docker logs -f blog-mahad-reverb

# Check Network
docker network inspect database_network
```
