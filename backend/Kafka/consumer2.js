const { Kafka } = require('kafkajs');
const write_car_data = require("../routes/car/write_data.js");

// kafka
const kafka = new Kafka({
    clientId: 'Consumer2',
    brokers: ['localhost:9092'],
});
const consumer = kafka.consumer({ groupId: 'carConsumer-100-5-5' });
const topic = 'carSystem';
const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({topic: topic});

    console.log('===============================');
    console.log('=======Consumer2 connect=======');
    console.log('===============================');
    await consumer.run ({
        eachMessage: async ({ topic, partition, message }) => {
            try{
                const work = JSON.parse(message.value.toString());
                await write_car_data(work.ID, work.data);
                // console.log(`Received message on topic ${topic}, 2partition ${partition}: `, work);
            }catch(error){
                console.error('Consumer2 Error: ', error);
            }
        },
    });
}

runConsumer().catch(error => {
    console.error('Error in consumer2:', error);
})
  