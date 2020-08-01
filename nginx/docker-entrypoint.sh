#!/usr/bin/env sh
set -eu

envsubst '${DOMAIN}' < /etc/nginx/conf.d/default-with-ssl.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"