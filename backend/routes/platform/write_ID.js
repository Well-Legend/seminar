const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
// const { resolve } = require('dns');
// const { rejects } = require('assert');


const write_in_ID = (data) => {
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
    const contract = new web3.eth.Contract(abi, '0xe8732E3AF02018E93Ce61807De3993a25Df5BA31');//contract address

    function send_transaction(){
        //調用函式所發起的合約
        return contract.methods.write_ID(data).send({//the function which want to test
            from: address,
            gas: 100000
            }).on('error', function (error) {
                console.log("Error is: ", error)
                throw error;
            }).on('transactionHash', function (transactionHash) {
                console.log("TransacttionHash is: ", transactionHash)
            }).on('receipt', function (receipt) {
                console.log("receipt: ", receipt) // contains the new contract address
            }); 
                       
    }

    async function next_step(receipt){
        if(receipt.status){
            console.log('Transaction confirmed!');
            //查看函式回傳值
            contract.methods.write_ID(data).call().catch((err) => {//function which want to test
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

module.exports = write_in_ID;