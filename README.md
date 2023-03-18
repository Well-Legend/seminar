# BlockChain
## Required Dependency and Installation

* make, nodejs, npm
```c
sudo apt install make nodejs npm
```

* geth
   * [Go-ethereum](https://geth.ethereum.org/)

* web3
```javascript
npm install web3
```

## Geth
### Command Introduce
1. Initial private chain

```go
geth --datadir ./data init genesis.json
```


   * ./data is a directory where your block data stored.
   * genesis.json is the information of your first block

2. Start your private chain

```go
geth --datadir node/private-chain-node2  --allow-insecure-unlock --nodiscover --syncmode full --networkid 100 --port 30303 --http --http.port 8545 --http.api "eth,net,web3,personal" --unlock c5f7f02e4833f2d8fdda9cd51e720793583b5a7a --password /home/well1314/node/private-chain-node2/password.txt console
```

3. Migrate contract

```javascript
node index.js
```

> If you haven't have private chain yet, you can use the command **puppeth** to *construct the private chain*.

# MongoDB
## Docker
1. Uninstall old versions

```c
sudo apt-get remove docker docker-engine docker.io containerd runc
```

2. Set up the repository

   * Update the apt package index and install packages to allow apt to use a repository over HTTPS

   ```c
   sudo apt-get update
   sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
   ```

   * Add Docker’s official GPG key
  
   ```c
   sudo mkdir -m 0755 -p /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   ```

   * Use the following command to set up the repository

   ```c
   echo \
   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

3. Install Docker Engine

   * Update the apt package index
   
   ```c
   sudo apt-get update
   ```

   * Install the latest version

   ```c
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```
## Installation
1. Install the latest version

   ```c
   docker pull mongo:latest
   ```

2. Check if mongo is installed

   ```c
   docker images
   ```

3. Create the container

   ```c
   docker run -itd --name mongo -p 27017:27017 mongo --auth
   ```
      * -p 27017:27017：投影容器服務的 27017 端口到主機的 27017 端口。外部可以直接通過主機 ip:27017 訪問 mongo 的服務
      * --auth：需要密碼才能訪問容器服務

## Command Introduce

   * Start Docker

   ```c
   sudo service docker start 
   docker start bb259ed6c7ecf59310e79e9a6ba9d9421f55f7403f1cb200c726501745b73a29
   ```

   * Start MongoDB
   
   ```c
   docker exec -it mongo bash
   ```

   * Connect to database
   
   ```c  
   mongosh
   ```

   * Check MongoDB is working

   ```c
   docker exec mongo mongosh --eval "print(version())"
   ```
