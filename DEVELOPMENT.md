# Installing Hashtopolis Server using Windows 10/11

1. Install the prerequisites [link](https://github.com/hashtopolis/server/wiki/Development-environment)
2. Go to the windows store and install Ubuntu
3. Open Docker desktop. Go to Settings -> General. You need the following options tick.
* Use the WSL 2 based engine
* Use Docker Compose V2
4. In Docker Settings, go to Resources -> WSL Integration, and enable integration with Ubuntu
5. Open the windows terminal and open the Ubuntu terminal, then install Hashtopolis Server
* Clone `git clone https://github.com/hashtopolis/server.git`
* Go to `cd server/`
* Run `git branch --remote`
* Run `git checkout feature/apiv2`
* Run `code`
5. Open Hashtopolis Server, go to .devcontainer and open Remote Containers (Vscode plugin)

# Installing Hashtopolis Server in Ubuntu

1. Clone project `git clone https://github.com/hashtopolis/server.git`
2. Get branch code `git clopull origin feature/apiv2`
3. Install docker-compose `sudo curl -L "https://github.com/docker/compose/releases/download/v2.1.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
4. Go to `cd server/.devcontainer`
5. Create container `sudo docker-compose up -d`  # run in background
