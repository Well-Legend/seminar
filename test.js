const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
const Web3EthContract = require('web3-eth-contract');
const { get } = require('http');

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
const source = fs.readFileSync('./backend/Car.sol', 'utf8');//file's relate address

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

const ID = "Well";
const data = {
  Data: "Data is okay now",
  timestamp: "此時此刻"
};

//test function in contract
const contract = new web3.eth.Contract(abi, '0x394c097625C5Afb98969322E2d2AeA3A36cA690A');//contract address

//調用函式所發起的合約
contract.methods.write_data(ID, data).send({//the function which want to test
  from: address,
  gas: 100000
  }, function (error, transactionHash) {
    //console.log(error, transactionHash)
  }).on('error', function (error) {
    console.log("Error is: ", error)
  }).on('transactionHash', function (transactionHash) {
    console.log("TransacttionHash is: ", transactionHash)
  }).on('receipt', function (receipt) {
    console.log("receipt: ", receipt) // contains the new contract address
  });
  console.log("success");

//查看函式回傳值
contract.methods.read_data(ID).call().catch((err) => {//function which want to test
return;
})
.then(console.log);





// //調用函式所發起的合約
// contract.methods.read_data(ID).send({//the function which want to test
//     from: address,
//     gas: 100000
//     }, function (error, transactionHash) {
//       console.log(error, transactionHash)
//     }).on('error', function (error) {
//       console.log("Error is: ", error)
//     }).on('transactionHash', function (transactionHash) {
//       console.log("TransacttionHash is: ", transactionHash)
//     }).on('receipt', function (receipt) {
//       console.log("receipt: ", receipt) // contains the new contract address
//     });
//     console.log("success");

// //查看函式回傳值
// contract.methods.read_data(ID).call().catch((err) => {//function which want to test
//   return;
//  })
// .then(console.log);

// //回調合約
// web3.eth.getBlock(8, function(error, result){
//     if(!error)
//         console.log(JSON.stringify(result));
//     else
//         console.error(error);
// })

