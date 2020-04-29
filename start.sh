#!/bin/bash

# Start web
# Start api
# Make rtmp port publicly accessible
# Start rtmp

# NOTE: You'll need to replace the ngrok remote TCP address
# with one from your own ngrok account or a use a randomly
# generated address from the free version. Don't forget to
# update RTMP env variables in `web` and `api`

concurrently \
  "cd web && yarn start" \
  "cd api && yarn start" \
  "ngrok tcp --remote-addr 1.tcp.ngrok.io:29644 1935" \
  "docker-compose -f rtmp/docker-compose.yml up --build"