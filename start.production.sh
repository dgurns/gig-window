#!/bin/bash

# This script pulls the latest `master` branch (ie. 
# production), pulls updated Docker images, and then
# starts the full backend (nginx, api, and redis), 
# providing it with staging env variables. 
# It also removes any outdated Docker images.

# This script is meant to be run on the server where 
# you are deploying the production environment.

# The production web app is served separately via Vercel
# but points to this backend.

git pull origin master

docker pull dgurney/gig-window-nginx:latest
docker pull dgurney/gig-window-api:latest

docker-compose -f docker-compose.production.yml up --build -d

docker image prune -f