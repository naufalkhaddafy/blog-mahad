FROM dunglas/frankenphp:php8.3-alpine

# Environment variables
ENV COMPOSER_MEMORY_LIMIT=-1
ENV SERVER_NAME=:80
ENV SERVER_ROOT=/app/public

# Install system dependencies and Node.js (for Vite/Dev)
# FrankenPHP is based on Alpine, so apk works.
RUN apk add --no-cache \
    git \
    curl \
    bash \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    shadow \
    dcron \
    icu-dev \
    nodejs \
    npm \
    linux-headers

# Install PHP extensions
# FrankenPHP includes some by default, but we ensure our required ones are there.
# pcntl is crucial for Reverb/Octane.
RUN install-php-extensions \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl \
    opcache \
    zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configure User (match host user mostly typically 1000)
# We use shadow package to modify www-data
RUN usermod -u 1000 www-data && groupmod -g 1000 www-data

WORKDIR /app

# In dev, we bind mount everything.
# Expose FrankenPHP (80), Vite (5173), Reverb (8080)
EXPOSE 80 5173 8080

# Default command (can be overridden in compose)
CMD ["frankenphp", "php-server"]
