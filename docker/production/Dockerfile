# ==============================
# Stage 1: Build frontend assets
# ==============================
FROM node:20-alpine AS node_builder


WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build


# ==============================
# Stage 2: Laravel PHP-FPM
# ==============================
FROM php:8.3-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    git curl bash libpng-dev oniguruma-dev libxml2-dev zip unzip shadow dcron

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy project files
COPY . .
COPY --from=node_builder /app/public/build ./public/build

# Install PHP dependencies & cache config
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

COPY docker/production/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# Default: run php-fpm
CMD ["php-fpm"]
