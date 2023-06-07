# Status
We are working on the beta release. **Please do not use yet**.

# Introduction

**Hashtopolis Web UI** is a free and open-source platform used for managing hashcat tasks.

# Installing & running

We recommend you install an official docker image release since the master source will often include untested features and modules. If you prefer to create your own Docker image, please follow the steps below.

## Prerequisites

First of all, you'll need to install [Hashtopolis Server](https://github.com/hashtopolis/server/tree/feature/apiv2), once installed you can continue.

1. Install Docker Desktop [Link](https://www.docker.com/products/docker-desktop/)
2. Clone the project or download the .zip `git clone https://github.com/hashtopolis/web-ui.git`

Notes:
* Please note that if you are installing Web UI and Server in different hosts, the server target as default is `http://localhost:8080/api/v2`

## Set up

1. Go to the folder `cd web-ui` and build the docker image `docker build . -t hashtopolis:latest`
2. Once installed start the project `docker run -d -p 4200:4200 --name hashtopolis-web-ui hashtopolis-web-ui:latest`

# Community

To simplify, we have 2 options:
* Code-related: Please use Github
* Non-code related: Use the Discord Server for seeking help from the community, feedback or requesting new features ;).
