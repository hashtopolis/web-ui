FROM node:18.15-bullseye as hashtopolis-web-ui-base
ENV PUPPETEER_SKIP_DOWNLOAD='true'
EXPOSE 4200

# Enable possible build args for injecting user commands
ARG CONTAINER_USER_CMD_PRE
ARG CONTAINER_USER_CMD_POST

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_OPTIONS='--use-openssl-ca'

# Add support for TLS inspection corporate setups, see .env.sample for details
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

# Check for and run optional user-supplied command to enable (advanced) customizations of the container
RUN if [ -n "${CONTAINER_USER_CMD_PRE}" ]; then echo "Applying CONTAINER_USER_CMD_PRE customizations..."; echo "${CONTAINER_USER_CMD_PRE}" | sh ; fi

RUN mkdir /app
WORKDIR /app

# Docker entry location
COPY docker-entrypoint.sh /usr/local/bin

# BUILD Image
#----BEGIN----
FROM hashtopolis-web-ui-base as hashtopolis-web-ui-build
# Coping the app into the container
COPY . ./

# npm package - clean install
COPY package-lock.json package.json ./

RUN npm ci
RUN npm run build
# ----END----


# PRODUCTION Image
# ----BEGIN----
FROM nginx:bullseye as hashtopolis-web-ui-prod
COPY --from=hashtopolis-web-ui-build /app/dist/ /usr/share/nginx/html
ENTRYPOINT [ "/bin/bash", "/usr/local/bin/docker-entrypoint.sh", "production" ]
# ----END----


# DEVELOPMENT Image
# ----BEGIN----
FROM hashtopolis-web-ui-base as hashtopolis-web-ui-dev
# Enable tooling like 'ng' for regular users
RUN echo "export PATH=/app/node_modules/.bin:${PATH}" >> /etc/profile.d/npm.inc.sh

# Install required tooling envsubst 
RUN apt-get update && apt-get -y install --no-install-recommends gettext-base 2>&1

USER node
ENTRYPOINT [ "/bin/bash", "/usr/local/bin/docker-entrypoint.sh", "development" ]
# ----END----
