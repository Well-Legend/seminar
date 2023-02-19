# block_chain
## Required Dependency and Installation

* make, nodejs, npm
'''c
sudo apt install make nodejs npm
'''

* geth
   * [Go-ethereum](https://geth.ethereum.org/)

## Geth
### Command Introduce
1.Initial private chain

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

