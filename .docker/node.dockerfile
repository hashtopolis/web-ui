### Stage 1 - Based in Nodejs image, build and compile ###
FROM node:16.17-alpine AS build-stage

# User to run locally
RUN addgroup -S appgroup && adduser -S appuser -u 1001 -G appgroup

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build --output-path=dist

### Stage 2 - Move files and config Nginx ###
FROM nginx:1.23.2-alpine

# Copy our nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# From builder
COPY --from=build-stage /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
