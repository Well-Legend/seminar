//Node Modules
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const axios = require('axios');

//Routes
const write_in_data = require("./routes/platform/write_data.js");
const read_in_contract = require("./routes/platform/read_data.js");

// const write_car_ID = require("./routes/car/write_ID.js");
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

app.post("/api/Data", (req, res) => {
    const input_event = req.body;
    var timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    var data = {
        myData: input_event.event,
        timestamp: timestamp
      };
    write_in_data(input_event.ID, data);
    res.send({
        ID: input_event.ID,
        data: data
    });
})

//Queue for car system
let cnt = 0;
app.post("/api/car/Data", async(req, res) => {
    const input = req.body;
    var timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    var data = {
        myData: input.event,
        timestamp: timestamp
    };
    var record = {
        ID: input.ID,
        data: data,
        timestamp: input.timestamp
    };
    cnt++;
    console.log('server端: ', record);
    if(cnt>300){
        cnt -= 300;
    }
    if(cnt%3==1){
        const kafka1Response = await axios.post('http://localhost:8081/api/car/Data/kafka1', record);
        console.log('kafka: ', kafka1Response.data);
        res.send({process1: kafka1Response.data});
    }
    else if(cnt%3==2){
        const kafka2Response = await axios.post('http://localhost:8082/api/car/Data/kafka2', record);
        res.send({process2: kafka2Response.data});
    }
    else{
        const kafka3Response = await axios.post('http://localhost:8083/api/car/Data/kafka3', record);
        res.send({process3: kafka3Response.data});
    }    
})

//QoS0 for car system
const mqttClient = mqtt.connect(null, {clientId: 'publisher'});

let QoS0_cnt = 0;
const QoS0_record_queue = [];

app.post("/api/car/Data/QoS0", async (req, res) => {
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

    QoS0_record_queue.push(record);
    QoS0_cnt++;

    if(QoS0_cnt%5 == 1){
        const work = QoS0_record_queue.shift();
        mqttClient.publish('carQoS0_1', JSON.stringify(work), { qos: 0 }, (error) => {
            if (error) {
                console.error('Failed to publish data to MQTT_1', error);
            } else {
                res.send({
                    ID: work.ID,
                    data: work.data.myData,
                    timestamp: input.timestamp
                });
                console.log('Data published to MQTT_1', work);
            }
        });
    }
    else if(QoS0_cnt%5 == 2){
        const work = QoS0_record_queue.shift();
        mqttClient.publish('carQoS0_2', JSON.stringify(work), { qos: 0 }, (error) => {
            if (error) {
                console.error('Failed to publish data to MQTT_2', error);
            } else {
                res.send({
                    ID: work.ID,
                    data: work.data.myData,
                    timestamp: input.timestamp
                });
                console.log('Data published to MQTT_2', work);
            }
        });
    }
    else if(QoS0_cnt%5 == 3){
        const work = QoS0_record_queue.shift();
        mqttClient.publish('carQoS0_3', JSON.stringify(work), { qos: 0 }, (error) => {
            if (error) {
                console.error('Failed to publish data to MQTT_3', error);
            } else {
                res.send({
                    ID: work.ID,
                    data: work.data.myData,
                    timestamp: input.timestamp
                });
                console.log('Data published to MQTT_3', work);
            }
        });
    }
    else if(QoS0_cnt%5 == 4){
        const work = QoS0_record_queue.shift();
        mqttClient.publish('carQoS0_4', JSON.stringify(work), { qos: 0 }, (error) => {
            if (error) {
                console.error('Failed to publish data to MQTT_4', error);
            } else {
                res.send({
                    ID: work.ID,
                    data: work.data.myData,
                    timestamp: input.timestamp
                });
                console.log('Data published to MQTT_4', work);
            }
        });
    }
    else if(QoS0_cnt%5 == 0){
        const work = QoS0_record_queue.shift();
        mqttClient.publish('carQoS0_5', JSON.stringify(work), { qos: 0 }, (error) => {
            if (error) {
                console.error('Failed to publish data to MQTT_5', error);
            } else {
                res.send({
                    ID: work.ID,
                    data: work.data.myData,
                    timestamp: input.timestamp
                });
                console.log('Data published to MQTT_5', work);
            }
        });
    }
});

//QoS1 for car system
mqttClient.on('connect', function () {
    console.log('QoS1_publisher connected to MQTT broker');
    mqttClient.subscribe('done_carQoS1_1', { qos: 1 }, function (error) {
        if (error) {
            console.error('mqttClient failed to subscribe to carQoS1_1 response topic', error);
        } else {
            console.log('mqttClient subscribed to carQoS1_1 response topic');
        }
    });
    mqttClient.subscribe('done_carQoS1_2', { qos: 1 }, function (error) {
        if (error) {
            console.error('mqttClient failed to subscribe to carQoS1_2 response topic', error);
        } else {
            console.log('mqttClient subscribed to carQoS1_2 response topic');
        }
    });
    mqttClient.subscribe('done_carQoS1_3', { qos: 1 }, function (error) {
        if (error) {
            console.error('mqttClient failed to subscribe to carQoS1_3 response topic', error);
        } else {
            console.log('mqttClient subscribed to carQoS1_3 response topic');
        }
    });
    mqttClient.subscribe('done_carQoS1_4', { qos: 0 }, function (error) {
        if (error) {
            console.error('mqttClient failed to subscribe to carQoS1_4 response topic', error);
        } else {
            console.log('mqttClient subscribed to carQoS1_4 response topic');
        }
    });
    mqttClient.subscribe('done_carQoS1_5', { qos: 1 }, function (error) {
        if (error) {
            console.error('mqttClient failed to subscribe to carQoS1_5 response topic', error);
        } else {
            console.log('mqttClient subscribed to carQoS1_5 response topic');
        }
    });
});

let QoS1_cnt = 0;
const QoS1_record_queue = [];

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

    QoS1_record_queue.push(record);
    QoS1_cnt++;

    //first time for each subscriber
    if(QoS1_cnt == 1){
        const work = QoS1_record_queue.shift();
        mqttClient.publish('carQoS1_1', JSON.stringify(work), { qos: 1 }, (error) => {
            if (error) {
                console.error('Failed to publish data to MQTT_1', error);
            } else {
                console.log('Data published to MQTT_1', work);
            }
        });
    }
    else if(QoS1_cnt == 2){
        const work = QoS1_record_queue.shift();
        mqttClient.publish('carQoS1_2', JSON.stringify(work), { qos: 1 }, (error) => {
            if (error) {
                console.error('Failed to publish data to MQTT_2', error);
            } else {
                console.log('Data published to MQTT_2', work);
            }
        });
    }
    else if(QoS1_cnt == 3){
        const work = QoS1_record_queue.shift();
        mqttClient.publish('carQoS1_3', JSON.stringify(work), { qos: 1 }, (error) => {
            if (error) {
                console.error('Failed to publish data to MQTT_3', error);
            } else {
                console.log('Data published to MQTT_3', work);
            }
        });
    }
    else if(QoS1_cnt == 4){
        const work = QoS1_record_queue.shift();
        mqttClient.publish('carQoS1_4', JSON.stringify(work), { qos: 1 }, (error) => {
            if (error) {
                console.error('Failed to publish data to MQTT_4', error);
            } else {
                console.log('Data published to MQTT_4', work);
            }
        });
    }
    else if(QoS1_cnt == 5){
        const work = QoS1_record_queue.shift();
        mqttClient.publish('carQoS1_5', JSON.stringify(work), { qos: 1 }, (error) => {
            if (error) {
                console.error('Failed to publish data to MQTT_5', error);
            } else {
                console.log('Data published to MQTT_5', work);
            }
        });
    }

    res.send({
        ID: work.ID,
        data: work.data.myData
    });
});

mqttClient.on('message', async function (topic, message) {
    if(QoS1_record_queue.length != 0){
        const work = QoS1_record_queue.shift();
        if (topic == 'done_carQoS1_1'){
            mqttClient.publish('carQoS1_1', JSON.stringify(work), { qos: 1 }, (error) => {
                if (error) {
                    console.error('Failed to publish data to MQTT_1', error);
                } else {
                    console.log('Data published to MQTT_1', work);
                }
            });
        }
        else if (topic == 'done_carQoS1_2'){
            mqttClient.publish('carQoS1_2', JSON.stringify(work), { qos: 1 }, (error) => {
                if (error) {
                    console.error('Failed to publish data to MQTT_2', error);
                } else {
                    console.log('Data published to MQTT_2', work);
                }
            });
        }
        else if (topic == 'done_carQoS1_3'){
            mqttClient.publish('carQoS1_3', JSON.stringify(work), { qos: 1 }, (error) => {
                if (error) {
                    console.error('Failed to publish data to MQTT_3', error);
                } else {
                    console.log('Data published to MQTT_3', work);
                }
            });
        }
        else if (topic == 'done_carQoS1_4'){
            mqttClient.publish('carQoS1_4', JSON.stringify(work), { qos: 1 }, (error) => {
                if (error) {
                    console.error('Failed to publish data to MQTT_4', error);
                } else {
                    console.log('Data published to MQTT_4', work);
                }
            });
        }
        else if (topic == 'done_carQoS1_5'){
            mqttClient.publish('carQoS1_5', JSON.stringify(work), { qos: 1 }, (error) => {
                if (error) {
                    console.error('Failed to publish data to MQTT_5', error);
                } else {
                    console.log('Data published to MQTT_5', work);
                }
            });
        }
    }
    else{
        QoS1_cnt = 0;
    }
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
