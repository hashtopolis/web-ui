FROM node:18.15-bullseye as hashtopolis-web-ui-base
ENV PUPPETEER_SKIP_DOWNLOAD='true'
EXPOSE 4200

COPY . ./
RUN npm run build

# PRODUCTION Image
# ----BEGIN----
FROM nginx:bullseye as hashtopolis-web-ui-prod
COPY --from=hashtopolis-web-ui-base /app/dist/ /usr/share/nginx/html
COPY docker-entrypoint.sh /usr/local/bin
ENTRYPOINT [ "docker-entrypoint.sh" ]
# ----END----


# DEVELOPMENT Image
# ----BEGIN----
FROM hashtopolis-web-ui-base as hashtopolis-web-ui-dev
COPY .devcontainer/docker-entrypoint.sh /usr/local/bin
USER node
ENTRYPOINT [ "docker-entrypoint.sh" ]

# ----END----
