FROM node:24.12-trixie AS hashtopolis-web-ui-base
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
FROM hashtopolis-web-ui-base AS hashtopolis-web-ui-build
COPY . ./

# npm package - clean install
COPY package-lock.json package.json ./

RUN npm ci
RUN npm run build
# ----END----


# DEVELOPMENT Image
# ----BEGIN----
FROM hashtopolis-web-ui-base AS hashtopolis-web-ui-dev
# Enable tooling like 'ng' for regular users
RUN echo "export PATH=/app/node_modules/.bin:${PATH}" >> /etc/profile.d/npm.inc.sh

# Install required tooling envsubst
RUN apt-get update && apt-get -y install --no-install-recommends gettext-base 2>&1

USER node
ENTRYPOINT [ "/bin/bash", "/usr/local/bin/docker-entrypoint.sh", "development" ]
# ----END----


# PRODUCTION Image
# ----BEGIN----
FROM nginx:trixie AS hashtopolis-web-ui-prod
COPY --from=hashtopolis-web-ui-build /app/dist/ /usr/share/nginx/html
COPY --from=hashtopolis-web-ui-build /usr/local/bin/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY ./nginx/hashtopolis.conf /etc/nginx/conf.d/default.conf

# Custom themes are opt-in at runtime via HASHTOPOLIS_CUSTOM_THEMES_DIR.
# By default this bakes an empty folder (no themes ship in the image). To bake
# themes, build with --build-arg CUSTOM_THEMES_DIR=custom-themes (or your own
# folder of *.css), then set HASHTOPOLIS_CUSTOM_THEMES_DIR=/custom-themes at
# runtime to enable them.
ARG CUSTOM_THEMES_DIR=docker/empty-custom-themes
COPY ${CUSTOM_THEMES_DIR}/ /custom-themes/

ENTRYPOINT [ "/bin/bash", "/usr/local/bin/docker-entrypoint.sh", "production" ]
# ----END----
