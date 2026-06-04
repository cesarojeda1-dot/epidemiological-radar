#!/usr/bin/env bash
set -e

if [ ! -f .env ]; then
  echo ".env not found. Copy .env.example to .env and edit the variables.";
  exit 1
fi

docker-compose up --build
