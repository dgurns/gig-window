#!/bin/bash

# This script starts the full backend (nginx, api, 
# redis, and rtmp) and provides it with staging env 
# variables. It also removes any outdated Docker 
# images.

# This script is meant to be run on the server where 
# you are deploying the staging environment.

# The staging web app is served separately via Vercel
# but points to this backend.

docker-compose -f docker-compose.staging.yml up --build -d
docker image prune -f