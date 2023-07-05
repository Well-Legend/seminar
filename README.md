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

#Test Environment
## K6
1. Installation

```c
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```


