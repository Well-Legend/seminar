const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
const mqtt = require('mqtt');

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
    const contract = new web3.eth.Contract(abi, '0x3192f72C332D7645542e0822Dc7E59B21E2121c3');//contract address
    
    // const mqtt_client = mqtt.connect();
    
    // // mqtt_client.on('connect', function(){
    // //     //Subscribe to MQTT topic
    // //     mqtt_client.subscribe('car');
    // // });

    // mqtt_client.on('message', function(topic, message){
    //     // Receive MQTT message and execute transaction logic
    //     const received_data = JSON.parse(message.toString());
    //     console.log(received_data);

    //     if(received_data.data === data){
    //         send_transaction(received_data.data).then((receipt) => {
    //             transaction_done(receipt);
    //         })
    //         .catch((error) => {
    //             console.error('Transaction failed: ', error);
    //         })
    //     }
    //     else{
    //         console.error('Invalid data format: ', received_data);
    //     }
    // })

    // function send_transaction(data){
    //     return contract.methods.write_data(data).send({
    //         from: address,
    //         gas: 100000
    //     });
    // }

    // function transaction_done(receipt) {
    //     if (receipt.status){
    //         console.log('Transaction confirmed!');
        
    //         // Publish message to MQTT to trigger next transaction
    //         mqtt_client.publish('car', 'Transaction completed', (error) => {
    //             if(error){
    //                 console.error('Failed to publish data to MQTT', error);
    //             }
    //             else{
    //                 console.log('Transaction completed. Data published to MQTT');
    //             }
    //         })
    //     }
    //     else {
    //         console.error('Transaction failed!');
    //         // Publish message to MQTT to trigger next transaction
    //         mqtt_client.publish('car', 'Transaction failed', (error) => {
    //             if (error) {
    //                 console.error('Failed to publish data to MQTT', error);
    //             } else {
    //                 console.log('Transaction failed. Data published to MQTT');
    //             }
    //         });
    //     }
    // }

    // return new Promise((resolve, reject) => {
    //     // Connect to MQTT broker
    //     // mqtt_client.on('connect', () => {
    //     //     // Subscribe to MQTT topic
    //     //     mqtt_client.subscribe('car', (error) => {
    //     //         if (error) {
    //     //             console.error('Failed to subscribe to MQTT topic', error);
    //     //             reject(error);
    //     //         } else {
    //     //             console.log('Subscribed to MQTT topic');
    //     //             resolve();
    //     //         }
    //     //     });
    //     // });
    
    //     // Handle MQTT connection errors
    //     // mqtt_client.on('error', (error) => {
    //     //     console.error('MQTT connection error:', error);
    //     //     reject(error);
    //     // });
    //     mqtt_client.on('connect', () => {
    //         console.log('Subscribed to MQTT topic');
    //         resolve();
    //     });

    //     // Handle MQTT connection errors
    //     mqtt_client.on('error', (error) => {
    //         console.error('MQTT connection error:', error);
    //         reject(error);
    //     });

    //     mqtt_client.subscribe('car', (error) => {
    //         if (error) {
    //             console.error('Failed to subscribe to MQTT topic', error);
    //             reject(error);
    //         }
    //     });
    // })

    const input_data = {
        Data: data.myData,
        timestamp: data.timestamp
    };

    function send_transaction(){
        return contract.methods.write_data(input_data).send({//the function which want to test
            from: address,
            gas: 1000000
            }).on('error', function (error) {
                console.log("Error is: ", error)
            }).on('transactionHash', function (transactionHash) {
                console.log("TransacttionHash is: ", transactionHash)
            }).on('receipt', function (receipt) {
                console.log("receipt: ", receipt) // contains the new contract address
            });
            //console.log("success");
    }

    async function transaction_done(receipt){
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
        return transaction_done(receipt);
    });
}

module.exports = write_in_data;