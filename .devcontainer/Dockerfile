FROM mcr.microsoft.com/devcontainers/typescript-node:1-16-bullseye

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
     && apt-get -y install --no-install-recommends chromium     
ENV CHROME_BIN=/usr/bin/chromium