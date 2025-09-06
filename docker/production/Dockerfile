# --- 1) Build FE (Vite) ---
FROM node:20-alpine AS node_builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY resources ./resources
COPY vite.config.* ./
COPY public ./public
RUN npm run build

# --- 2) Install PHP vendor (match runtime) ---
FROM php:8.3-cli-alpine AS composer_deps
ENV COMPOSER_ALLOW_SUPERUSER=1 COMPOSER_MEMORY_LIMIT=-1
RUN apk add --no-cache git zip unzip icu-dev libzip-dev oniguruma-dev \
 && docker-php-ext-install mbstring pcntl bcmath intl
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction \
    --optimize-autoloader --no-ansi --no-progress --no-scripts

# --- 3) FINAL: PHP-FPM runtime (tanpa Node/Composer) ---
FROM php:8.3-fpm-alpine AS app
RUN apk add --no-cache git curl bash libpng-dev oniguruma-dev libxml2-dev zip unzip icu-dev \
 && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd intl opcache
WORKDIR /var/www/html
# source (hormati .dockerignore)
COPY . .
# artefak dari builder
COPY --from=composer_deps /app/vendor ./vendor
COPY --from=node_builder /app/public/build ./public/build
# izin + php-fpm boleh baca ENV dari docker-compose
RUN adduser -D -H -u 1000 www \
 && chown -R www:www /var/www/html \
 && find storage -type d -exec chmod 775 {} \; \
 && chmod -R 775 bootstrap/cache \
 && sed -i 's~^;*clear_env\s*=.*~clear_env = no~' /usr/local/etc/php-fpm.d/www.conf \
 && { echo 'opcache.enable=1'; echo 'opcache.validate_timestamps=0'; echo 'opcache.jit_buffer_size=64M'; } \
    > /usr/local/etc/php/conf.d/opcache.ini
# symlink storage (abaikan bila sudah)
RUN php artisan storage:link || true
# entrypoint: re-cache pakai ENV runtime
COPY docker/production/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm", "-F"]

# --- (Opsional) Nginx image yang bawa kode + public/build ---
FROM nginx:alpine AS nginx
WORKDIR /var/www/html
COPY docker/production/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=app /var/www/html .
# USER 101  # optional
