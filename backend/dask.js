//Node Modules
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

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

const task_queue = [];
let task_count = 0;
const MAX_TASK_COUNT = 40;

app.post("/api/car/Data", async(req, res) =>{
    const input = req.body;
    var timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    var data = {
        myData: input.event,
        timestamp: timestamp
      };

    // function send_ID(){
    //     return new Promise((resolve, reject) =>{
    //         write_car_ID(input.ID).then(() => {
    //             resolve("ID輸入成功");
    //         }).catch((error) => {
    //             reject(error);
    //         });
    //     });
    // }

    // function send_data(){
    //     return new Promise((resolve, reject) =>{
    //         write_car_data(data).then(() =>{
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

    // post_success();

    if (task_count >= MAX_TASK_COUNT){
        res.status(429).send('Too Many Request');
        return;
    }

    task_queue.push(() => write_car_ID(input.ID));
    task_queue.push(() => write_car_data(data));
    task_count += 2;

    if(task_queue.length >= 2){
        await task_queue[0]();
        await task_queue[1]();
        task_queue.splice(0, 2);
        task_count -= 2;
    }

    // console.log(task_queue.slice());
    res.send({
        ID: input.ID,
        data: data
    });
})

app.get("/api/Data", (req,res) =>{
    const carID = req.query.carID; 
    read_in_contract(carID).then((data) => {
        console.log('Data retrieved from smart contract:', data);
        res.send(data);
    });
})

const server = app.listen(port, () => {
    console.log("App listening on port 8080");
});
