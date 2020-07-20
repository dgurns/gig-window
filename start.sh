#!/bin/bash

# Start the app locally
# Expose RTMP server to the web

# NOTE: You'll need to set up your own custom ngrok config
# if you want to expose your local setup to the web:
# https://ngrok.com/docs#config
# At the very least you'll need to expose the RTMP server
# so you can send a stream to it from your encoder.
# Also if using ngrok don't forget to update your env 
# variables to point to the ngrok domains!

# If you only want to start certain services, you can run:
# docker-compose up redis rtmp

# To run the db on its own:
# docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:alpine

concurrently \
  "docker-compose up" \
  "ngrok start corona-window-rtmp"