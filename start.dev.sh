#!/bin/bash

# This script starts the full local dev environment, with
# web and api automatically reloading on file saves

# Run db and redis locally via docker-compose
# Expose api via ngrok so it can receive webhooks from Mux
# Run api locally
# Run web locally

# If you only want to start certain services, you can run:
# docker-compose -f docker-compose.dev.yml up redis

# To run the db on its own:
# docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:alpine

concurrently \
  "docker-compose -f docker-compose.dev.yml up" \
  "nginx start gig-window-api" \
  "cd api && yarn start" \
  "cd web && yarn start"