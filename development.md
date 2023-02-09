# Development

This document describes the process for running this application in your local environtment.

# UI-Hashtopolis

**UI-Hashtopolis** is a free and open-source platform used for managing "guessing" password tools. It's written in **typescript** using the Angular framework.

# Development Status

We will have a beta soon.

# Screenshots

<!-- ![Hashtopolis - Animated gif demo](demo/intro1.gif) -->

# INSTALLING & RUNNING

To install and run **UIHastopolis**, you need Docker or the last version of Nodejs. We recommend you install a package release since the master will often include untested features and modules.

We will release a beta soon.

## Pre-Installation - Setp up Back end API

1. Clone project `git clone -b feature/apiv2 https://github.com/hashtopolis/server.git`
2. Go to the  `.devcontainer` folder in the project and run `docker-compose up -d`

Notes:
- Can not create hashlist/files? You could be facing folder permissions. Run `chown vscode:vscode tmp/ files/ import/`


# Installation and set up UI using Docker (Recommended)

1. Install Docker Desktop

2. Clone the project or download the .zip (Before continuing read "**Config Global Settings**")

3. Run the multistage Dockerfile, Run `docker build -t hashtopolis-client .` (Careful with don't delete the dot)

4. Run `docker run -p 80:80 hashtopolis-client`

## Build the Docker UI Image

1. Run `docker-compose build nginx`.

2. Tag the image with your Docker Hub repo name:

    ```bash
    docker tag nginx-uihashtopolis <YOUR_DOCKER_HUB_NAME>/nginx-uihashtopolis
    ```

3. Push the image to Docker Hub:

    ```bash
    docker push <YOUR_DOCKER_HUB_NAME>/nginx-uihashtopolis
    ```

# Installation and compiling with Nodejs || Angular

1. Install the latest LTS version of Node.js from https://nodejs.org.

2. Clone the project or download the .zip (Before continuing read "**Config Global Settings**")

3. Go to the folder then: Run `npm install` to install app dependencies

4. Run `ng build --watch` to build and bundle the code. Once compiled you can find the code in the `/dist` folder.

5. Run `npm start` to launch the App, alternative if you have installed Angular just run `ng server`

# Config Global Settings

As this application works entirely with REST API, you might need to make some changes to establish a seamless connection.  In some scenarios, you'll need to customize 2 files. 

## Connection
The first file is in src/config/default/app/main.ts  

* prodApiEndpoint: Backend API Default is `http://localhost:8080/api/v2`
* prodApiPort: Backend API port. As default is 8080
* frontEndUrl: Front API url. Default `http://localhost`

The second file is in src/proxy.conf.json

* target: Default is `http://localhost:8080/api/v2`

## Other

| Main | Description |
| --- | --- |
| `prodApiMaxResults` | As default all API calls are limited to `3000`, you can increase/decrease this value. |
| `devApiEndpoint` | API endpoint for mock up data |
| `agentURL` | Backend API path |
| `agentdownloadURL` | Backend API path, where a agent file is downloaded |
| `appName` | App Name |
| `chunkSizeTUS` | File size chunk (Note. Unit is in bits) |

If you want to customize the logo/title, see table below.

| Header/Brand | Description |
| --- | --- |
| `logo` | Path to change the default logo. |
| `name` | As default empty, otherwise it'll add a title besides the logo |
| `height` | You can play with the logo height |
| `width` | You can play with the logo width |

Customize some behaviour in the Agents module.

| Agents | Description |
| --- | --- |
| `statusOrderBy` | Options `asc` and `desc`. Default `asc` |
| `statusOrderByName` | Options `agentName`, `agentId`. Default `agentName` |

You might want to change some default parameters when a task is being created.

| Tasks | Description |
| --- | --- |
| `priority` | Task priority. Default `0` |
| `maxAgents` | Max. Agents assigned to the task. Default `0` |
| `chunkTime` | Chunk Time. Default `600` |
| `chunkSize` | Chunk Size. Default `0` |
| `statusTimer` | Status Timer. Default `5`. |


# Community

To simplify, we have 2 options:
* Code-related: Please use Github
* Non-code related: Use the Discord Server for seeking help from the community, feedback or requesting new features ;).
