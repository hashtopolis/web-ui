FROM node:18.15-bullseye
EXPOSE 4200

RUN mkdir /app

WORKDIR /app

COPY .devcontainer/docker-entrypoint.sh /usr/local/bin
ENTRYPOINT [ "docker-entrypoint.sh" ]
