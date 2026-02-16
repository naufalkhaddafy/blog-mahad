#!/bin/bash
set -e

case "$1" in
  octane)
    exec php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=80 --admin-port=2019 --caddyfile=/app/docker/production/Caddyfile
    ;;
  reverb)
    exec php artisan reverb:start --host=0.0.0.0 --port=8080
    ;;
  scheduler)
    exec php artisan schedule:work
    ;;
  queue)
    exec php artisan queue:work --tries=3
    ;;
  *)
    exec "$@"
    ;;
esac
