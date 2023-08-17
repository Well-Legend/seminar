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

app.post("/api/car/Data/kafka3", async(req, res) =>{
    const record = req.body;
    console.log('8083: ', record);
    const kafkaMessage = {
        value: JSON.stringify(record)
    }
    await producer.connect()
    await producer.send({
      topic: 'carSystem',
      messages: [kafkaMessage]
    })
    
    await producer.disconnect()
    res.send('done');
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});