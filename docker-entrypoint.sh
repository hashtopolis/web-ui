#!/bin/sh

# Check if environment variable HASHTOPOLIS_BACKEND_URL is set
# and use it with envsubst to set the backend url in the config.json
if [ -n "$HASHTOPOLIS_BACKEND_URL" ]; then
  echo "Using HASHTOPOLIS_BACKEND_URL: $HASHTOPOLIS_BACKEND_URL"
  envsubst < /usr/share/nginx/html/assets/config.json.example > /usr/share/nginx/html/assets/config.json
fi

echo "Done setting up Hashtopolis frontend. Starting nginx..."
nginx -g 'daemon off;'