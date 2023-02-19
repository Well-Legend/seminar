const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
const Web3EthContract = require('web3-eth-contract');

/*
* connect to ethereum node
*/ 
const ethereumUri = 'http://localhost:8545';
const address = '0xc5f7f02e4833F2d8FddA9cD51E720793583B5A7a'; //user
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

//test function in contract
const contract = new web3.eth.Contract(abi, '0xba2b6c297b0b2ce1b0837b2301803b858cff62c4');
//調用函式所發起的合約
contract.methods.getNotesLen(address).send({
    from: address,
    gas: 1000000
    }, function (error, transactionHash) {
      console.log(error, transactionHash)
    }).on('error', function (error) {
      console.log(error)
    }).on('transactionHash', function (transactionHash) {
      console.log(transactionHash)
    }).on('receipt', function (receipt) {
      console.log("YA", receipt) // contains the new contract address
    });
    console.log("success");
//查看函式回傳值
contract.methods.getNotesLen(address).call()
.then(console.log);

// //回調合約
// web3.eth.getBlock(8, function(error, result){
//     if(!error)
//         console.log(JSON.stringify(result));
//     else
//         console.error(error);
// })