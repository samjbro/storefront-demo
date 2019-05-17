#!/bin/bash

# Log in to the Heroku Docker CLI
echo "$HEROKU_PASSWORD" | docker login --username=_ --password-stdin registry.heroku.com

# Tag the pushed Docker image for Heroku
docker tag "$DOCKER_ID"/turing-proxy registry.heroku.com/turing-samjbro-proxy/web
docker tag "$DOCKER_ID"/turing-client registry.heroku.com/turing-samjbro-client/web
docker tag "$DOCKER_ID"/turing-api registry.heroku.com/turing-samjbro-api/web

# Push to Heroku
docker push registry.heroku.com/turing-samjbro-proxy/web
docker push registry.heroku.com/turing-samjbro-client/web
docker push registry.heroku.com/turing-samjbro-api/web
