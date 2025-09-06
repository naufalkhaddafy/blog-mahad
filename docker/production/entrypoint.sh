#!/bin/sh
set -e
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true

# rebuild caches pakai ENV runtime (.env / env_file)
php artisan config:clear || true
php artisan cache:clear  || true
php artisan route:clear  || true
php artisan view:clear   || true
php artisan config:cache || true
php artisan route:cache  || true
php artisan view:cache   || true

exec "$@"
