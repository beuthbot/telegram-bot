#!/usr/bin/env bash

# short and simple bash script for simplifying deployment process on
# on productive machine.  make shure there is a `.env` file specifying
# the telegram token before running this script.

# print commands
set -x

# reset git project
git reset HEAD --hard

# fetch latest git update
git pull

# rebuild and start docker container
docker-compose up --build -d
