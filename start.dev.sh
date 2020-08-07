#!/bin/bash

# This script starts the full local dev environment, with
# web and api automatically reloading on file saves

# Run db, redis, and rtmp locally via docker-compose
# Expose rtmp to the web
# Run api locally
# Run web locally

# NOTE: You'll need to set up your own custom ngrok config
# if you want to expose your local setup to the web:
# https://ngrok.com/docs#config
# At the very least you'll need to expose the RTMP server
# so you can send a stream to it from your encoder.
# Also if using ngrok don't forget to update your env 
# variables to point to the ngrok domains!

# If you only want to start certain services, you can run:
# docker-compose -f docker-compose.dev.yml up redis rtmp

# To run the db on its own:
# docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:alpine

concurrently \
  "docker-compose -f docker-compose.dev.yml up" \
  "ngrok start corona-window-rtmp" \
  "cd api && yarn start" \
  "cd web && yarn start" \