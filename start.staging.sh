#!/bin/bash

# This script pulls updated Docker images and then
# starts the full backend (nginx, api, and redis), 
# providing it with staging env variables. 
# It also removes any outdated Docker images.

# This script is meant to be run on the server where 
# you are deploying the staging environment.

# The staging web app is served separately via Vercel
# but points to this backend.

docker pull dgurney/gig-window-nginx:latest
docker pull dgurney/gig-window-api:latest

docker-compose -f docker-compose.staging.yml up --build -d

docker image prune -f