#!/bin/bash

# Start web
# Start api and make it publicly accessible
# Start rtmp and make it publicly accessible

# NOTE: You'll need to replace these ngrok domains 
# with ones from your own ngrok account

concurrently \
  "cd web && yarn start" \
  "ngrok http -subdomain=corona-window-api 4000" \
  "cd api && yarn start" \
  "ngrok tcp --remote-addr 1.tcp.ngrok.io:29644 1935" \
  "docker-compose -f rtmp/docker-compose.yml up"