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
## Installation
1. Open WSL terminal and to the main directory

```c
cd ~
```
2. Update Ubuntu

```c
sudo apt update
```

3. Import the public key used by the package management system

```c
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
```

4. Create a list file for MongoDB

```c
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

5. Reload the local package database

```c
sudo apt-get update
```

6. Install MongoDB

```c
sudo apt-get install -y mongodb-org
```

7. Whether it downloads succesfully and Check the version

```c
mongod --version
```

8. Create the directory to store data

```c
mkdir -p ~/data/db
```

9. Run the Mongo instance

```c
sudo mongod --dbpath ~/data/db
```

10. Check the Mongo instance is working

```c
ps -e | grep 'mongod'
```

11. Stop the MongoDB Shell

   * Ctrl+C