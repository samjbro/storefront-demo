#!/bin/bash

echo "building test images"

docker build -t "$DOCKER_ID"/turing-api-test ./api