const mqtt = require('mqtt');
const write_car_data = require("../routes/car/write_data.js");

const QoS1_subscriber5 = mqtt.connect(null, {clientId: 'QoS1_subscriber5'});

QoS1_subscriber5.on('connect', function () {
    console.log('Subscriber5 connected to MQTT broker');
    QoS1_subscriber5.subscribe('carQoS1_5', { qos: 1 }, function (error) {
        if (error) {
            console.error('Subscriber5 failed to subscribe to carQoS1_5 topic', error);
        } else {
            console.log('Subscriber5 subscribed to carQoS1_5 topic');
        }
    });
});

QoS1_subscriber5.on('message', async function (topic, message) {
        const work = JSON.parse(message);
        await write_car_data(work.ID, work.data);
        QoS1_subscriber5.publish('done_carQoS1_5', 'car_QoS1_5 finish', { qos: 1 }, (error) => {
            if (error) {
                console.error('===== Failed to publish finish message to QoS1 =====', error);
            } else {
                console.log('===== Finish message published to QoS1 =====');
            }
        })
});