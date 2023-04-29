FROM node:18.15-bullseye
ENV PUPPETEER_SKIP_DOWNLOAD='true'
EXPOSE 4200

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

#COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT [ "npm", "start" ]
