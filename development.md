# Installing Hashtopolis Server using Windows 10/11

1. Install the prerequisites [link](https://github.com/hashtopolis/server/wiki/Development-environment)
2. Go to the windows store and install Ubuntu
3. Open Docker desktop. Go to Settings -> General. You need the following options tick.
* Use the WSL 2 based engine
* Use Docker Compose V2
4. In Docker Settings, go to Resources -> WSL Integration, and enable integration with Ubuntu
5. Open the windows terminal and open the Ubuntu terminal, then install Hashtopolis Server
* Clone `git clone https://github.com/hashtopolis/server.git`
* Run `cd server/`
* Run `git branch --remote`
* Run `git checkout feature/apiv2`
* Run `code`
5. Open Hashtopolis Server, go to .devcontainer and open Remote Containers (Vscode plugin)

# Installing Hashtopolis Server in Ubuntu

