const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
// const { resolve } = require('dns');
// const { rejects } = require('assert');


const write_in_data = (data) => {
    /*
    * connect to ethereum node
    */ 
    const ethereumUri = 'http://localhost:8545';
    const address = '0xc5f7f02e4833F2d8FddA9cD51E720793583B5A7a'; //user
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
    const contract = new web3.eth.Contract(abi, '0x3357a3dC1eC3d6938Ea443Fb4040588EaAc8F26C');//contract address

    const input_data = {
        Data: data.myData,
        timestamp: data.timestamp
    };

    function send_transaction(){
        return contract.methods.write_data(input_data).send({//the function which want to test
            from: address,
            gas: 100000
            }).on('error', function (error) {
                console.log("Error is: ", error)
            }).on('transactionHash', function (transactionHash) {
                console.log("TransacttionHash is: ", transactionHash)
            }).on('receipt', function (receipt) {
                console.log("receipt: ", receipt) // contains the new contract address
            });
            //console.log("success");
    }

    async function next_step(receipt){
        if(receipt.status){
            console.log('Transaction confirmed!');
            contract.methods.write_data(input_data).call().catch((err) => {//function which want to test
                return;
            })
            .then(console.log);
        }
        else{
            console.error('Transaction failed!');
        }
    }
        
    return send_transaction().then((receipt) => {
        return next_step(receipt);
    });
}

module.exports = write_in_data;