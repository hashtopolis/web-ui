FROM node:18.15-bullseye
ENV PUPPETEER_SKIP_DOWNLOAD='true'
EXPOSE 4200

RUN mkdir /app
WORKDIR /app

# Storing npm install to speed-up building
COPY package-lock.json package.json ./
RUN npm ci

# Coping the app into the container
COPY . ./
RUN npm run build

#TODO: switch to nginx instead of ng serve development server
ENTRYPOINT [ "npm", "start" ]
