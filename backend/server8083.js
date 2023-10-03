const express = require("express");
const { Kafka } = require('kafkajs')
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8083;

// kafka
const kafka = new Kafka({
    clientId: 'Server8083',
    brokers: ['localhost:9092'],
});
const producer = kafka.producer();

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors
app.use(cors());

// express
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static('./view/dist'));

let cnt = 2;
app.post("/api/car/Data/kafka3", async(req, res) =>{
    const partition = cnt%5;
    console.log('8083Partition: ', partition);
    const record = req.body;
    console.log('8083: ', record);
    const key = partition.toString();

    const kafkaMessage = {
        key: key, 
        value: JSON.stringify(record),
        partition: partition
    }
    await producer.connect();
    await producer.send({
      topic: 'carSystem',
      messages: [kafkaMessage]
    })
    
    cnt+=3;
    if(cnt>=300)
    {
        cnt-=300;
    }

    // await producer.disconnect();
    res.send(record);
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});