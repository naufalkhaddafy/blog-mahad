#!/bin/bash
set -e

case "$1" in
  octane)
    echo "Clearing stale cache..."
    php artisan optimize:clear
    php artisan package:discover
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
    php artisan optimize:clear
    php artisan package:discover
    php artisan optimize
    exec php artisan schedule:work
    ;;
  queue)
    # Queue worker juga perlu config fresh
    php artisan optimize:clear
    php artisan package:discover
    php artisan optimize
    exec php artisan horizon
    ;;
  *)
    exec "$@"
    ;;
esac
