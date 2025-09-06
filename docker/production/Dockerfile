# =========================
# Stage 0: Build FE (Vite)
# =========================
FROM node:20-alpine AS node_builder
WORKDIR /app
# Lebih cepat & cacheable
COPY package.json package-lock.json ./
RUN npm ci
COPY resources ./resources
COPY vite.config.* ./
COPY public ./public
RUN npm run build

# =========================
# Stage 1: Composer vendor
# =========================
FROM composer:2 AS composer_deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-ansi --no-progress --optimize-autoloader

# =========================
# Stage 2: App source
# =========================
FROM alpine:3.20 AS app_src
WORKDIR /var/www/html
# copy seluruh source (kecuali yang di-ignore oleh .dockerignore)
COPY . .
# vendor & assets build
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
# Opcache untuk production
RUN { \
  echo 'opcache.enable=1'; \
  echo 'opcache.validate_timestamps=0'; \
  echo 'opcache.jit_buffer_size=64M'; \
} > /usr/local/etc/php/conf.d/opcache.ini

# Cache Laravel SEKALI saat build (production)
# Kalau APP_KEY butuh saat cache config, pastikan .env tersedia saat build
# (atau export APP_* via ARG/ENV di build)
RUN php artisan config:cache \
 && php artisan route:cache \
 && php artisan view:cache \
 || true

# symlink storage (abaikan error jika sudah)
RUN php artisan storage:link || true

# entrypoint ringan: set permission storage (berguna jika pakai volume)
COPY docker/production/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["php-fpm", "-F"]

# =========================
# Stage 4: Nginx runtime
# =========================
FROM nginx:alpine AS nginx
WORKDIR /var/www/html
COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=app_src /var/www/html .
# (opsional) non-root fs untuk keamanan tambahan
# USER 101
