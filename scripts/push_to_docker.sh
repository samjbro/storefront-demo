#!/bin/bash

if [[ "$TRAVIS_BRANCH" = "master" && "$TRAVIS_PULL_REQUEST" = false ]] ; then
# Build images
  docker build -t "$DOCKER_ID"/turing-proxy ./proxy/docker
  docker build -t "$DOCKER_ID"/turing-client ./client/docker
  docker build -t "$DOCKER_ID"/turing-api ./api/docker
# Log in to the Docker CLI
  echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_ID" --password-stdin
# Push images to Docker Hub
  docker push "$DOCKER_ID"/turing-proxy
  docker push "$DOCKER_ID"/turing-client
  docker push "$DOCKER_ID"/turing-api
else
  echo "Skipping push to Docker as we're not on the master branch"
fi
