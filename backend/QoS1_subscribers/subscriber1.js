const mqtt = require('mqtt');
const write_car_data = require("../routes/car/write_data.js");

const QoS1_subscriber1 = mqtt.connect(null, {clientId: 'QoS1_subscriber1'});

QoS1_subscriber1.on('connect', function () {
    console.log('Subscriber1 connected to MQTT broker');
    QoS1_subscriber1.subscribe('carQoS1_1', { qos: 1 }, function (error) {
        if (error) {
            console.error('Subscriber1 failed to subscribe to carQoS1_1 topic', error);
        } else {
            console.log('Subscriber1 subscribed to carQoS1_1 topic');
        }
    });
});

QoS1_subscriber1.on('message', async function (topic, message) {
        const work = JSON.parse(message);
        await write_car_data(work.ID, work.data);
        QoS1_subscriber1.publish('done_carQoS1_1', 'car_QoS1_1 finish', { qos: 1 }, (error) => {
            if (error) {
                console.error('===== Failed to publish finish message to QoS1 =====', error);
            } else {
                console.log('===== Finish message published to QoS1 =====');
            }
        })
});