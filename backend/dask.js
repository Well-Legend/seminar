//Node Modules
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

//Routes
const write_in_data = require("./routes/platform/write_data.js");
const write_in_ID = require("./routes/platform/write_ID.js");
const read_in_contract = require("./routes/platform/read_data.js");

const write_car_ID = require("./routes/car/write_ID.js");
const write_car_data = require("./routes/car/write_data.js");
// 創建一個 Express 應用程式
const app = express();

const port = 8080;


// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors
app.use(cors());

// express
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static('./view/dist'));

app.post("/api/ID", (req, res) => {
    const data = req.body;
    write_in_ID(data.ID);
    res.send(data.ID);
})

app.post("/api/Data", (req, res) => {
    const input_event = req.body;
    var timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    var data = {
        myData: input_event.event,
        timestamp: timestamp
      };
    write_in_data(data);
    res.send(data);
})

//Queue for car system
const data_queue = [];
let processing = false;

app.post("/api/car/Data/Queue", async(req, res) => {
    const input = req.body;
    var timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    var data = {
        myData: input.event,
        timestamp: timestamp
    };
    var record = {
        ID: input.ID,
        data: data
    };

    data_queue.push(record);

    if (data_queue.length > 0 && data_queue[data_queue.length - 1] === record) {
        res.send({
            ID: data_queue[data_queue.length - 1].ID,
            data: data_queue[data_queue.length - 1].data
        });
    }

    if (!processing) {
        process_next_transaction();
    }
});

function process_next_transaction() {
    if (data_queue.length === 0 || processing) {
        return;
    }

    processing = true;

    // 取出下一筆資料
    const work = data_queue.shift();

    write_car_ID(work.ID)
        .then(() => {
            return write_car_data(work.data);
        })
        .then(() => {
            processing = false;
            process_next_transaction();
        })
        .catch((error) => {
            console.error('Transaction: ', work.ID, work.data, 'Failed:', error);
            processing = false;
            process_next_transaction();
        });
}

//QoS0 for car system
const mqttClient = mqtt.connect();

mqttClient.on('connect', function () {
    console.log('Connected to MQTT broker');

    mqttClient.subscribe('car', function (error) {
        if (error) {
            console.error('Failed to subscribe to MQTT topic', error);
        } else {
            console.log('Subscribed to MQTT topic');
        }
    });
});

const data_queue_QoS0 = [];
let processing_QoS0 = false;

app.post("/api/car/Data/QoS0", async(req, res) =>{
    const input = req.body;
    var timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    var data = {
        myData: input.event,
        timestamp: timestamp
    };
    var record = {
        ID: input.ID,
        data: data
    };

    data_queue_QoS0.push(record);

    //Public data to MQTT for each transaction
    mqttClient.publish('car', JSON.stringify({ message: 'Next transaction' }), { qos: 0 }, (error) => {
        if(error) {
            console.error('Failed to publish data to MQTT', error);
        }
        else{
            console.log('Data published to MQTT', record);
            res.send({
                ID: record.ID,
                data: record.data.myData
            });
        //    post_success();
        }
    });
})

//Subscribe to MQTT 以處理下一筆交易
mqttClient.on('message', function (topic, message) {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.message === 'Next transaction') {
        process_next_transaction_QoS1();
        process_next_transaction_QoS0();
    }
});

function process_next_transaction_QoS0(){
    if(data_queue_QoS0.length === 0 || processing_QoS0){
        return;
    }

    processing_QoS0 = true;

    //取出下一筆資料
    const work = data_queue_QoS0.shift();

    write_car_ID(work.ID).then(() => {
        return write_car_data(work.data);
    })
    .then(() => {
        processing_QoS0 = false;
        process_next_transaction_QoS0();
    })
    .catch((error) => {
        console.error('Transaction: ', work.ID, work.data, 'Failed:', error);
        processing_QoS0 = false;
        process_next_transaction_QoS0();
    });
}

//QoS1 for car system
mqttClient.on('connect', function () {
    console.log('Connected to MQTT broker');

    mqttClient.subscribe('car', { qos: 1 }, function (error) {
        if (error) {
            console.error('Failed to subscribe to MQTT topic', error);
        } else {
            console.log('Subscribed to MQTT topic');
        }
    });
});

const data_queue_QoS1 = [];
let processing_QoS1 = false;

function process_next_transaction_QoS1(){
    if(data_queue_QoS1.length === 0 || processing_QoS1){
        return;
    }

    processing_QoS1 = true;

    //取出下一筆資料
    const work = data_queue_QoS1.shift();

    write_car_ID(work.ID).then(() => {
        return write_car_data(work.data);
    })
    .then(() => {
        processing_QoS1 = false;
        process_next_transaction_QoS1();
    })
    .catch((error) => {
        console.error('Transaction: ', work.ID, work.data, 'Failed:', error);
        processing_QoS1 = false;
        process_next_transaction_QoS1();
    });
}

app.post("/api/car/Data/QoS1", async(req, res) =>{
    const input = req.body;
    var timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    var data = {
        myData: input.event,
        timestamp: timestamp
    };
    var record = {
        ID: input.ID,
        data: data
    };

    data_queue_QoS1.push(record);

    //Public data to MQTT for each transaction with QoS 1
    mqttClient.publish('car', JSON.stringify({ message: 'Next transaction' }), { qos: 1 }, (error) => {
        if(error) {
            console.error('Failed to publish data to MQTT', error);
        }
        else{
            console.log('Data published to MQTT with QoS 1', record);
            res.send({
                ID: record.ID,
                data: record.data.myData
            });
        }
    });
})

app.get("/api/Data", (req,res) =>{
    const carID = req.query.carID; 
    read_in_contract(carID).then((data) => {
        console.log('Data retrieved from smart contract:', data);
        res.send(data);
    });
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
