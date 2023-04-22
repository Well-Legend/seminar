//Node Modules
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

//Routes
const write_in_data = require("./routes/write_data.js");
const write_in_ID = require("./routes/write_ID.js");
const read_in_contract = require("./routes/read_data.js");

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
    //var timestampValue = timestamp.getTime();
    //const timestampValue = timestamp.toISOString().substring(0, 19).replace("T", " ");
    var data = {
        myData: input_event.event,
        timestamp: timestamp
      };
    // write_in_data(data.event);
    // res.send(data.event);
    write_in_data(data);
    res.send(data);
})

app.get("/api/Data", (req,res) =>{
    const carID = req.query.carID; 
    read_in_contract(carID).then((data) => {
        console.log('Data retrieved from smart contract:', data);
        res.send(data);
    });
})

app.listen(port, () => {
    console.log("App listening on port 8080");
});
