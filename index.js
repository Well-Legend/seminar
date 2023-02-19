const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

/*
* connect to ethereum node
*/ 
const ethereumUri = 'http://localhost:8545';
const address = '0xc5f7f02e4833f2d8fdda9cd51e720793583b5a7a'; //user
const password = 'well1314'
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
if(!web3.isConnected()){
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
}else{
    console.log('connected to ehterum node at ' + ethereumUri);
    let coinbase = web3.eth.coinbase;
    console.log('coinbase:' + coinbase);
    let balance = web3.eth.getBalance(coinbase);
    console.log('balance:' + web3.fromWei(balance, 'ether') + " ETH");
    let accounts = web3.eth.accounts;
    console.log(accounts);

    //部署時解鎖帳戶
    if(web3.personal.unlockAccount(address, password)){
        console.log(`${address} is unlocked`);
    }else{
        console.log(`unlock failed, ${address}`);
    }
}

//input the contract
const source = fs.readFileSync('./contracts/Note.sol', 'utf8');

//compile the contract
const input = {
    language: 'Solidity',
    sources:{
        'Note.sol':{
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*':['*'],
            },
        },
    },
};

const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
const contractFile = tempFile.contracts['Note.sol']['NoteContract'];

//get bin and abi
const bytecode = contractFile.evm.bytecode.object;
//console.log(bytecode);
const abi = contractFile.abi;
//console.log(abi);

//deploy contract
let gasEstimate = web3.eth.estimateGas({data: '0x' + bytecode});
console.log('gasEstimate = ' + gasEstimate);

let MyContract = web3.eth.contract(abi);
console.log('deploying contract...');

let myContractReturned = MyContract.new([], {
    from: address,
    data: '0x'+ bytecode,
    gas: gasEstimate + 50000
}, function (err, myContract) {
    if (!err) {
        // NOTE: The callback will fire twice!
        // Once the contract has the transactionHash property set and once its deployed on an address.
      
        // e.g. check tx hash on the first call (transaction send)
        if (!myContract.address) {
            console.log(`myContract.transactionHash = ${myContract.transactionHash}`); // The hash of the transaction, which deploys the contract
          
        // check address on the second call (contract deployed)
        } else {
            console.log(`myContract.address = ${myContract.address}`); // the contract address
            global.contractAddress = myContract.address;
        }
      
        // Note that the returned "myContractReturned" === "myContract",
        // so the returned "myContractReturned" object will also get the address set.
    } else {
        console.log(err);
    }
});

(function wait () {
    setTimeout(wait, 1000);
})();
