#!/bin/bash

# Start web
# Start api
# Start rtmp and make it publicly accessible

# NOTE: You'll need to replace the ngrok remote address
# with one from your own ngrok account

concurrently \
  "cd web && yarn start" \
  "cd api && yarn start" \
  "ngrok tcp --remote-addr 1.tcp.ngrok.io:29644 1935" \
  "docker-compose -f rtmp/docker-compose.yml up --build"