#!/bin/sh
export PUPPETEER_SKIP_DOWNLOAD='true'
echo "Waiting for workspace to be mounted"
until [ -f /app/package.json ]
do
     sleep 5
done
echo "Workspace mounted"
npm install
npm start
