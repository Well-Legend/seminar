const mqtt = require('mqtt');
const write_car_data = require("../routes/car/write_data.js");

const QoS1_subscriber2 = mqtt.connect(null, {clientId: 'QoS1_subscriber2'});

QoS1_subscriber2.on('connect', function () {
    console.log('Subscriber2 connected to MQTT broker');
    QoS1_subscriber2.subscribe('carQoS1_2', { qos: 1 }, function (error) {
        if (error) {
            console.error('Subscriber2 failed to subscribe to carQoS1_2 topic', error);
        } else {
            console.log('Subscriber2 subscribed to carQoS1_2 topic');
        }
    });
});

QoS1_subscriber2.on('message', async function (topic, message) {
        const work = JSON.parse(message);
        await write_car_data(work.ID, work.data);
        QoS1_subscriber2.publish('done_carQoS1_2', 'car_QoS1_2 finish', { qos: 1 }, (error) => {
            if (error) {
                console.error('===== Failed to publish finish message to QoS1 =====', error);
            } else {
                console.log('===== Finish message published to QoS1 =====');
            }
        })
});