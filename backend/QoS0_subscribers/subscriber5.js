const mqtt = require('mqtt');
const write_car_data = require("../routes/car/write_data.js");

const QoS0_subscriber5 = mqtt.connect(null, {clientId: 'QoS0_subscriber5'});

QoS0_subscriber5.on('connect', function(){
    console.log('Subscriber5 connected to MQTT broker');
    QoS0_subscriber5.subscribe('carQoS0_5', { qos: 0 }, function (error) {
        if (error) {
            console.error('Subscriber5 failed to subscribe to carQoS0_5 topic', error);
        } else {
            console.log('Subscriber5 subscribed to carQoS0_5 topic');
        }
    });
})

QoS0_subscriber5.on('message', async function (topic, message) {
    const work = JSON.parse(message);
    await write_car_data(work.ID, work.data);
    QoS0_subscriber5.publish('done_carQoS0_5', 'car_QoS0_5 finish', { qos: 0 }, (error) => {
        if (error) {
            console.error('===== Failed to publish finish message to QoS0 =====', error);
        } else {
            console.log('===== Finish message published to QoS0 =====');
        }
    })
});