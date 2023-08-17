const mqtt = require('mqtt');
const write_car_data = require("../routes/car/write_data.js");

const QoS1_subscriber4 = mqtt.connect(null, {clientId: 'QoS1_subscriber4'});

QoS1_subscriber4.on('connect', function () {
    console.log('Subscriber4 connected to MQTT broker');
    QoS1_subscriber4.subscribe('carQoS1_4', { qos: 1 }, function (error) {
        if (error) {
            console.error('Subscriber4 failed to subscribe to carQoS1_4 topic', error);
        } else {
            console.log('Subscriber4 subscribed to carQoS1_4 topic');
        }
    });
});

QoS1_subscriber4.on('message', async function (topic, message) {
        const work = JSON.parse(message);
        await write_car_data(work.ID, work.data);
        QoS1_subscriber4.publish('done_carQoS1_4', 'car_QoS1_4 finish', { qos: 1 }, (error) => {
            if (error) {
                console.error('===== Failed to publish finish message to QoS1 =====', error);
            } else {
                console.log('===== Finish message published to QoS1 =====');
            }
        })
});