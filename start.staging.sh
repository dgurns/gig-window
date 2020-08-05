#!/bin/bash

docker-compose -f docker-compose.staging.yml up --build -d
docker image prune -f