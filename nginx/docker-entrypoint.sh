#!/usr/bin/env sh
set -eu

envsubst '${DOMAIN}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec "$@"