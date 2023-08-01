#!/bin/bash

environment=${1:-"production"}

# Check if environment variable HASHTOPOLIS_BACKEND_URL is set
# and use it with envsubst to set the backend url in the $app_cfg_base/config.json
function update_app_config {
  app_cfg_base="$1"
  if [ -n "$HASHTOPOLIS_BACKEND_URL" ]; then
    echo "Using HASHTOPOLIS_BACKEND_URL: $HASHTOPOLIS_BACKEND_URL"
    envsubst < ${app_cfg_base}/assets/config.json.example > ${app_cfg_base}/assets/config.json
  fi

  echo "Done configuring up Hashtopolis frontend (env=$environment) at $app_cfg_base/assets.config.json"
}


# Ensure workspace is mounted
echo -n "Waiting for workspace to be mounted..."
until [ -f /app/package.json ]
do
      sleep 5
done
echo "DONE"


if [ "$environment" = "development" ]; then
  # Install/Update required Node.js packages
  export PUPPETEER_SKIP_DOWNLOAD='true'
  npm install

  # Prepare configuration
  update_app_config "/app/src"

  # Start worker instance
  echo "Starting worker npm..."
  npm start
else
  # Prepare configuration
  update_app_config "/usr/share/nginx/html/assets"

  # Start worker instance
  echo "Starting worker  npm..."
  nginx -g 'daemon off;'
fi