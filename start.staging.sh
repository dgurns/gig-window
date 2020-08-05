#!/bin/bash

docker-compose -f docker-compose.staging.yml up --force-recreate --build -d
docker image prune -f