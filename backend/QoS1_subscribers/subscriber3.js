const mqtt = require('mqtt');
const write_car_data = require("../routes/car/write_data.js");

const QoS1_subscriber3 = mqtt.connect(null, {clientId: 'QoS1_subscriber3'});

QoS1_subscriber3.on('connect', function () {
    console.log('Subscriber3 connected to MQTT broker');
    QoS1_subscriber3.subscribe('carQoS1_3', { qos: 1 }, function (error) {
        if (error) {
            console.error('Subscriber3 failed to subscribe to carQoS1_3 topic', error);
        } else {
            console.log('Subscriber3 subscribed to carQoS1_3 topic');
        }
    });
});

QoS1_subscriber3.on('message', async function (topic, message) {
        const work = JSON.parse(message);
        await write_car_data(work.ID, work.data);
        QoS1_subscriber3.publish('done_carQoS1_3', 'car_QoS1_3 finish', { qos: 1 }, (error) => {
            if (error) {
                console.error('===== Failed to publish finish message to QoS1 =====', error);
            } else {
                console.log('===== Finish message published to QoS1 =====');
            }
        })
});