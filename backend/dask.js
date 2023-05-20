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

// tracer middleware
// app.use((req, res, next) => {
//     const span = tracer.startSpan(`request ${req.method} ${req.path}`);
//     span.setAttributes({
//         "http.method": req.method,
//         "http.url": req.url,
//     });
//     req.span = span;
//     res.on("finish", () => {
//         // console.log(span);
//         span.setAttribute("http.status_code", res.statusCode);
//         span.end();
//     });
//     next();
// });

// // root router
// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

// // router-api
// const apiRouter = require('./routes/api.js');
// app.use("/api", apiRouter);

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

const data_queue = [];
let processing = false;

app.post("/api/car/Data", async(req, res) =>{
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

    //Public data to MQTT for each transaction
    mqttClient.publish('car', 'Next transaction', JSON.stringify(record), (error) => {
        if(error) {
            console.error('Failed to publish data to MQTT', error);
        }
        else{
            console.log('Data published to MQTT');
        //    post_success();
        }
    });

    res.send({
        ID: input.ID,
        data: data
    });

    // function send_ID(){
    //     return new Promise((resolve, reject) =>{
    //         write_car_ID().then(() => {
    //             resolve("ID輸入成功");
    //         }).catch((error) => {
    //             reject(error);
    //         });
    //     });
    // }

    // function send_data(){
    //     return new Promise((resolve, reject) =>{
    //         write_car_data().then(() =>{
    //             resolve("event輸入成功");
    //         }).catch((error) => {
    //             reject(error);
    //         });

    //     });
    // }
    // async function post_success(){
    //     let post_ID = await send_ID();
    //     console.log(post_ID);
    //     let post_data = await send_data();
    //     console.log(post_data);
    //     res.send({
    //         ID: input.ID,
    //         data: data
    //     });
    // }
})

//Subscribe to MQTT 以處理下一筆交易
mqttClient.on('message', function (topic, message) {
    if (message.toString() === 'Next transaction') {
      process_next_transaction();
    }
});

function process_next_transaction(){
    if(data_queue.length === 0 || processing){
        return;
    }

    processing = true;

    //取出下一筆資料
    const work = data_queue.shift();

    write_car_ID(work.ID).then(() => {
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
