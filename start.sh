#!/bin/bash

# Start db
# Start web
# Start api
# Start rtmp
# Make web, api, and rtmp publicly accessible via ngrok

# NOTE: You'll need to set up your own custom ngrok config
# if you want to expose your local setup to the web:
# https://ngrok.com/docs#config
# At the very least you'll need to expose the RTMP server
# so you can send a stream to it from your encoder.
# Also if using ngrok don't forget to update your env 
# variables to point to the ngrok domains!

concurrently \
  "docker run -v `pwd`/postgres-data:/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:alpine" \
  "cd web && yarn start" \
  "cd api && yarn start" \
  "docker-compose -f rtmp/docker-compose.yml up --build" \
  "ngrok start corona-window-web corona-window-api corona-window-rtmp"