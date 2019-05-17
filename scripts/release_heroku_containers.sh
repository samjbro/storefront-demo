(
  echo "$HEROKU_CREDENTIALS_EMAIL"
  echo "$HEROKU_CREDENTIALS_PASSWORD"
) | heroku login
# Release container within Heroku
heroku container:release web --app turing-samjbro-proxy
heroku container:release web --app turing-samjbro-client
heroku container:release web --app turing-samjbro-api
