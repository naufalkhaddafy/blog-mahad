# =========================
# Stage 0: Build FE (Vite)
# =========================
FROM node:20-alpine AS node_builder
WORKDIR /app
# cache-friendly install
COPY package.json package-lock.json ./
RUN npm ci
# salin yang dibutuhkan untuk build
COPY resources ./resources
COPY vite.config.* ./
COPY public ./public
RUN npm run build

# =========================
# Stage 1: Composer vendor (pakai PHP yg sama dgn runtime)
# =========================
FROM php:8.3-cli-alpine AS composer_deps
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_MEMORY_LIMIT=-1
# tool & ext dasar agar composer tidak protes
RUN apk add --no-cache git zip unzip icu-dev libzip-dev oniguruma-dev
RUN docker-php-ext-install mbstring pcntl bcmath intl
# ambil binary composer dari image resmi
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
# kalau ada repo privat, siapkan auth.json (opsional)
# COPY auth.json /root/.composer/auth.json

RUN composer install \
    --no-dev --prefer-dist --no-interaction \
    --optimize-autoloader --no-ansi --no-progress --no-scripts

# =========================
# Stage 2: App source (gabungkan src + vendor + assets)
# =========================
FROM alpine:3.20 AS app_src
WORKDIR /var/www/html
# salin seluruh source (hormati .dockerignore)
COPY . .
# vendor & build assets dari stage sebelumnya
COPY --from=composer_deps /app/vendor ./vendor
COPY --from=node_builder /app/public/build ./public/build

# permission dasar
RUN adduser -D -H -u 1000 www \
 && chown -R www:www /var/www/html \
 && find storage -type d -exec chmod 775 {} \; \
 && chmod -R 775 bootstrap/cache

# =========================
# Stage 3: PHP-FPM runtime
# =========================
FROM php:8.3-fpm-alpine AS php-fpm
RUN apk add --no-cache git curl bash libpng-dev oniguruma-dev libxml2-dev zip unzip icu-dev \
 && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd intl opcache

WORKDIR /var/www/html
COPY --from=app_src /var/www/html .

# Cache Laravel SEKALI saat build (abaikan error bila APP_KEY belum ada saat build)
RUN php artisan config:cache \
 && php artisan route:cache \
 && php artisan view:cache \
 || true

# symlink storage (abaikan error jika sudah)
RUN php artisan storage:link || true

# Entrypoint ringan: set permission saat start (berguna bila storage di-mount)
COPY docker/production/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["php-fpm", "-F"]

# =========================
# Stage 4: Nginx runtime (bawa code + public/build)
# =========================
FROM nginx:alpine AS nginx
WORKDIR /var/www/html
# konfig nginx
COPY docker/production/nginx/default.conf /etc/nginx/conf.d/default.conf
# bawa seluruh app termasuk public/build
COPY --from=app_src /var/www/html .
# (opsional) USER non-root
# USER 101
