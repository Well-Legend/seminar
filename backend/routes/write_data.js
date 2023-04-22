const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');


const write_in_data = (data) => {
    /*
    * connect to ethereum node
    */ 
    const ethereumUri = 'http://localhost:8545';
    const address = '0xc5f7f02e4833F2d8FddA9cD51E720793583B5A7a'; //user
    const password = 'well1314'
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

    //input the contract
    const source = fs.readFileSync('./Car.sol', 'utf8');//file's relate address
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

    //test function in contract
    const contract = new web3.eth.Contract(abi, '0x9576D073804BF345C6891Bc31D443c46AC4ea8f9');//contract address

    const input_data = {
        Data: data.myData,
        timestamp: data.timestamp
    };

    contract.methods.write_data(input_data).send({//the function which want to test
        from: address,
        gas: 100000
        }, function (error, transactionHash) {
        console.log(error, transactionHash)
        }).on('error', function (error) {
        console.log("Error is: ", error)
        }).on('transactionHash', function (transactionHash) {
        console.log("TransacttionHash is: ", transactionHash)
        }).on('receipt', function (receipt) {
        console.log("receipt: ", receipt) // contains the new contract address
        });
        console.log("success");

    contract.methods.write_data(input_data).call().catch((err) => {//function which want to test
        return;
        })
        .then(console.log);
}

module.exports = write_in_data;