# Development

This guide covers setting up a local development environment for the Hashtopolis Web UI, the Angular frontend of Hashtopolis. For installing and running Hashtopolis itself (server and agents), see the documentation at <https://docs.hashtopolis.org>.

## Prerequisites

- [Node.js](https://nodejs.org) and npm. The supported versions are pinned in the `engines` field of [`package.json`](package.json).
- A running Hashtopolis server to develop against. See the [installation guide](https://docs.hashtopolis.org/installation_guidelines/basic_install/) and the [Docker guide](https://docs.hashtopolis.org/installation_guidelines/docker/) for how to set one up, or the [server repository](https://github.com/hashtopolis/server) to run it from source.

## Running the app

```bash
npm install
npm start
```

The app is served at <http://localhost:4200> and rebuilds on file changes.

The frontend expects the backend at `http://localhost:8080/api/v2` by default. To use a different backend, edit `hashtopolis_backend_url` in [`src/assets/config.json`](src/assets/config.json).

## API contract sync

The API contract lives in [`openapi.json`](openapi.json), a committed snapshot of the spec the backend serves. The TypeScript types and Zod schemas in `src/generated/api` are generated from it and are also committed — never edit them by hand.

[`.backend-ref`](.backend-ref) pins the exact `hashtopolis/server` commit this snapshot came from. It must always hold a full commit SHA (not a branch name), so CI compares against a fixed target and an unrelated backend merge cannot break frontend builds retroactively.

- `npm run check:openapi-sync` — verify `openapi.json` matches the backend spec at the pinned commit. Fetches from GitHub; pass `--server-path ../server` to compare against a local server checkout instead, or `--ref <sha>` to compare against a different commit.
- `npm run generate` — fetch the spec from a running backend (`localhost:8080`) and regenerate `src/generated`. After regenerating, update `.backend-ref` to the backend commit the spec came from.
- `npm run generate:api` — regenerate `src/generated` from the committed `openapi.json` only (no backend needed).

CI (the *OpenAPI Sync* workflow) fails a pull request when the committed spec does not match the pinned backend commit, when the spec does not lint, or when `src/generated` is stale. A nightly job additionally compares the snapshot against backend `master`; when it fails, it is time to bump `.backend-ref` and regenerate — in a dedicated PR, so the contract change is reviewed in one place.

A frontend PR that depends on unreleased backend changes points `.backend-ref` at that backend commit in the same PR, and moves it forward once the backend side has merged.

## Dev container

The repository ships a [dev container configuration](.devcontainer/devcontainer.json) that provides a container with the correct Node version and serves the app on port 4200. Open the project in any editor that supports dev containers, for example VS Code with the Dev Containers extension (which also installs the recommended extensions) or a JetBrains IDE. To use a backend other than the default, set the `HASHTOPOLIS_BACKEND_URL` environment variable.

The same container also runs without dev container tooling, directly via Docker Compose:

```bash
docker compose -f .devcontainer/docker-compose.yml up
```
