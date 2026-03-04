#!/bin/bash
set -e

case "$1" in
  octane)
    echo "Clearing stale cache..."
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
    echo "Rebuilding optimized cache..."
    php artisan optimize
    echo "Starting Octane..."
    exec php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=80 --admin-port=2019 --caddyfile=/app/docker/production/Caddyfile
    ;;
  reverb)
    exec php artisan reverb:start --host=0.0.0.0 --port=8080
    ;;
  scheduler)
    # Scheduler juga perlu config fresh
    php artisan config:clear
    php artisan optimize
    exec php artisan schedule:work
    ;;
  queue)
    # Queue worker juga perlu config fresh
    php artisan config:clear
    php artisan optimize
    exec php artisan queue:work --tries=3
    ;;
  *)
    exec "$@"
    ;;
esac
