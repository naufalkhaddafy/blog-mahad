FROM dunglas/frankenphp:php8.3-alpine AS builder

# 1. Build Assets (Node.js)
FROM node:20-alpine AS frontend
WORKDIR /app
# Build Args for Vite (Must be passed during docker build)
ARG VITE_REVERB_APP_KEY
ARG VITE_REVERB_HOST
ARG VITE_REVERB_PORT
ARG VITE_REVERB_SCHEME

# Make them available as ENV for the build command
ENV VITE_REVERB_APP_KEY=$VITE_REVERB_APP_KEY \
    VITE_REVERB_HOST=$VITE_REVERB_HOST \
    VITE_REVERB_PORT=$VITE_REVERB_PORT \
    VITE_REVERB_SCHEME=$VITE_REVERB_SCHEME

COPY package*.json vite.config.js ./
RUN npm ci
COPY resources/ resources/
# Copy public if exists or needed, but usually public is output destination or static files
COPY public/ public/ 
RUN npm run build

# 2. Build Backend (Composer)
FROM composer:2 AS backend
WORKDIR /app
COPY composer.json composer.lock ./
COPY app/helper_fn.php app/helper_fn.php
# Install deps without dev and optimize autoloader, and NO SCRIPTS (because code isn't copied yet)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs --no-scripts

# 3. Final Production Image
FROM dunglas/frankenphp:php8.3-alpine

# Environment variables for Production
ENV COMPOSER_MEMORY_LIMIT=-1 \
    SERVER_NAME=:80 \
    SERVER_ROOT=/app/public \
    APP_ENV=production \
    APP_DEBUG=false

# Install System Dependencies (Minimal)
# pcntl is required for Octane/Reverb
RUN apk add --no-cache \
    icu-dev \
    libzip-dev \
    libpng-dev \
    oniguruma-dev \
    bash \
    && install-php-extensions \
    pcntl \
    bcmath \
    gd \
    intl \
    opcache \
    zip \
    pdo_mysql \
    redis

WORKDIR /app

# Copy Backend Dependencies
COPY --from=backend /app/vendor/ /app/vendor/

# Copy Frontend Assets (Vite Build)
COPY --from=frontend /app/public/build/ /app/public/build/

# Copy Application Code
COPY . .

# Permissions (Ensure www-data owns the app)
RUN chown -R www-data:www-data /app \
    && chmod -R 775 /app/storage /app/bootstrap/cache

# Switch to non-root user for security (Optional but best practice if possible, usually 1000)
# FrankenPHP runs as root by default to bind port 80/443, but we can drop privileges in config if needed.
# For now, we stay default but ensure storage is writable.

# Entrypoint: Install Octane & Start Server
# Ensure config is cached (reads .env) before anything else runs
CMD ["sh", "-c", "php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=80 --admin-port=2019"]
