#!/bin/sh
export PUPPETEER_SKIP_DOWNLOAD='true'

echo -n "Waiting for workspace to be mounted..."
until [ -f /app/package.json ]
do
     sleep 5
done
echo "DONE"

npm install
npm start