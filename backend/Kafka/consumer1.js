const { Kafka } = require('kafkajs');

// kafka
const kafka = new Kafka({
    clientId: 'Consumer1',
    brokers: ['localhost:9092'],
});
const consumer = kafka.consumer({ groupId: 'carConsumer', fromBeginning: true });
const topic = 'carSystem';

const runConsumer = async () => {
    await consumer.subscribe({ topic });
    await consumer.connect();
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message on topic ${topic}, partition ${partition}: ${message.value.toString()}`);
        },
    });
}

runConsumer().catch(error => {
    console.error('Error in consumer1:', error);
})
  