const { Kafka } = require('kafkajs');
const write_car_data = require("../routes/car/write_data.js");

// kafka
const kafka = new Kafka({
    clientId: 'Consumer5',
    brokers: ['localhost:9092'],
});
const consumer = kafka.consumer({ groupId: 'carConsumer///100///50' });
const topic = 'carSystem';
const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: topic });

    console.log('===============================');
    console.log('=======Consumer5 connect=======');
    console.log('===============================');
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try{
                const work = JSON.parse(message.value.toString());
                await write_car_data(work.ID, work.data);
                // console.log(`Received message on topic ${topic}, 5partition ${partition}: `, work);
            }catch(error){
                console.error('Consumer5 Error: ', error);
            }
        },
    });
}

runConsumer().catch(error => {
    console.error('Error in Consumer5:', error);
})
  