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
// if(!web3.isConnected()){
//     throw new Error('unable to connect to ethereum node at ' + ethereumUri);
// }else{
//     console.log('connected to ehterum node at ' + ethereumUri);
//     let coinbase = web3.eth.coinbase;
//     console.log('coinbase:' + coinbase);
//     let balance = web3.eth.getBalance(coinbase);
//     console.log('balance:' + web3.fromWei(balance, 'ether') + " ETH");
//     let accounts = web3.eth.accounts;
//     console.log(accounts);

//     //部署時解鎖帳戶
//     if(web3.personal.unlockAccount(address, password)){
//         console.log(`${address} is unlocked`);
//     }else{
//         console.log(`unlock failed, ${address}`);
//     }
// }

//input the contract
const source = fs.readFileSync('./contracts/Car.sol', 'utf8');//file's relate address

//compile the contract
const input = {
    language: 'Solidity',
    sources:{
        'Car.sol':{//file name
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
const contractFile = tempFile.contracts['Car.sol']['CE_store'];//[file name][contract name]

//get bin and abi
const bytecode = contractFile.evm.bytecode.object;
//console.log(bytecode);
const abi = contractFile.abi;
//console.log(abi);

//deploy contract
let gasEstimate = web3.eth.estimateGas({data: '0x' + bytecode});
console.log('gasEstimate = ' + gasEstimate);

var MyContract = new web3.eth.Contract(abi);
console.log('deploying contract...');

MyContract.deploy({
    data: bytecode,
    arguments: [] //constructor參數
})
.send({
    from: address,
    gas: 1500000,
    gasPrice: '30000'
}, function(error, transactionHash){ 
    console.log(error, transactionHash) 
})
.on('error', function(error){ 
    console.log("The error comes to: ",error) 
})
.on('transactionHash', function(transactionHash){ 
    console.log("The transactionHash is: ", transactionHash) 
})
.on('receipt', function(receipt){
   console.log("The contract address is: ", receipt.contractAddress) // contains the new contract address
})
.on('confirmation', function(confirmationNumber, receipt){ 
    console.log("confirmation done, the confirmation number is: ", confirmationNumber) 
})
.then(function(newContractInstance){
    console.log("instance with the new contract address is: ", newContractInstance.options.address) // instance with the new contract address
});

(function wait () {
    setTimeout(wait, 1000);
})();
