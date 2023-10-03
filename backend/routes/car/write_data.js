const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
const mqtt = require('mqtt');

const write_in_data = (ID, data) => {
    /*
    * connect to ethereum node
    */ 
    const ethereumUri = 'http://localhost:8545';
    const address = '0xc5f7f02e4833F2d8FddA9cD51E720793583B5A7a'; //user
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

    //input the contract
    const source = fs.readFileSync(__dirname + '/../../Car.sol', 'utf8');//file's relate address
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
    const contract = new web3.eth.Contract(abi, '0x394c097625C5Afb98969322E2d2AeA3A36cA690A');//contract address

    const input_data = {
        Data: data.myData,
        timestamp: data.timestamp
    };
    
    function send_transaction(){
        return contract.methods.write_data(ID, input_data).send({//the function which want to test
            from: address,
            gas: 1000000
            }).on('error', function (error) {
                console.log("Error is: ", error);
            }).on('transactionHash', function (transactionHash) {
                console.log("TransacttionHash is: ", transactionHash);
            }).on('receipt', function (receipt) {
                //test time
                // var timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
                var timestamp = Date.now();
                console.log("Transaction Done Time: ", timestamp);   
                console.log("receipt: ", receipt.transactionHash) // contains the new contract address
            });
    }

    async function transaction_done(receipt){
        if(receipt.status){
            contract.methods.write_data(ID, input_data).call().catch((err) => {//function which want to test
                return;
            })
            .then(console.log('Transaction confirmed!'));
        }
        else{
            console.error('Transaction failed!');
        }
    }
        
    return send_transaction().then((receipt) => {
        return transaction_done(receipt);
    });
}

module.exports = write_in_data;