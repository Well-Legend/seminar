# 啟動以太坊節點
cd ..
geth --datadir node/private-chain-node2 --allow-insecure-unlock --nodiscover --syncmode full --networkid 100 --port 30303 --http --http.port 8545 --http.api "eth,net,web3,personal" --unlock c5f7f02e4833f2d8fdda9cd51e720793583b5a7a --password /home/well1314/seminar/node/private-chain-node2/password.txt console
