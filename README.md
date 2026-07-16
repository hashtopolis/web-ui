# Hashtopolis Web UI

The **Hashtopolis Web UI** is the Angular-based frontend for [Hashtopolis](https://hashtopolis.org), a free and open-source platform for
distributing and managing [hashcat](https://hashcat.net/hashcat/) tasks across a fleet of agents. This repository contains the web client 
that talks to the Hashtopolis backend server through its REST API (see [`openapi.json`](openapi.json) for the API specification).

## Documentation

The full documentation, including setup guides, architecture and user guides, is hosted at **<https://docs.hashtopolis.org>**. 
If you are looking for how to install, configure or use Hashtopolis, that is the place to start.

## Frontend Overview

The frontend is an Angular application. Key parts of the repository:

- `src/` - application source code (components, services, routes, ...)
- `angular.json` - Angular workspace configuration
- `package.json` - npm scripts and dependencies
- `openapi.json` / `openapi-ts.config.mjs` - OpenAPI specification and client generation config used to talk to the backend
- `docker/`, `Dockerfile`, `docker-compose.yml` - containerized build and deployment
- `nginx/` - production web server configuration

To get a local development environment running, follow the instructions in [DEVELOPMENT](DEVELOPMENT.md).

## Contributing

Contributions are welcome! Before opening a pull request, please read:

- [CONTRIBUTING](CONTRIBUTING.md) - how to report bugs, suggest enhancements and submit pull requests.
- [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) - expected behaviour in the project.
- [STYLE_GUIDE](STYLE_GUIDE.md) - naming, formatting and Angular-specific conventions used throughout the codebase.
- [DEVELOPMENT](DEVELOPMENT.md) - how to set up a local development environment.

## License

This project is released under the terms of the [LICENSE](LICENSE).
