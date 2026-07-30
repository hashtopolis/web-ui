# Development

This guide covers setting up a local development environment for the Hashtopolis Web UI, the Angular frontend of Hashtopolis. For installing and running Hashtopolis itself (server and agents), see the documentation at <https://docs.hashtopolis.org>.

## Prerequisites

- [Node.js](https://nodejs.org) and npm. The supported versions are pinned in the `engines` field of [`package.json`](package.json).
- A running Hashtopolis server with APIv2 enabled to develop against. See the [installation guide](https://docs.hashtopolis.org/installation_guidelines/basic_install/) and the [Docker guide](https://docs.hashtopolis.org/installation_guidelines/docker/) for how to set one up, or the [server repository](https://github.com/hashtopolis/server) to run it from source.

## Running the app

```bash
npm install
npm start
```

The app is served at <http://localhost:4200> and rebuilds on file changes.

The frontend expects the backend at `http://localhost:8080/api/v2` by default. To use a different backend, edit `hashtopolis_backend_url` in [`src/assets/config.json`](src/assets/config.json).

## Dev container (VS Code)

The repository ships a [dev container configuration](.devcontainer/devcontainer.json). Open the project in VS Code with the Dev Containers extension to get a container with the correct Node version and the recommended extensions, serving the app on port 4200. Set the `HASHTOPOLIS_BACKEND_URL` environment variable to point the app at your backend.
