const mqtt = require('mqtt');
const write_car_data = require("../routes/car/write_data.js");

const QoS0_subscriber3 = mqtt.connect(null, {clientId: 'QoS0_subscriber3'});

QoS0_subscriber3.on('connect', function(){
    console.log('Subscriber3 connected to MQTT broker');
    QoS0_subscriber3.subscribe('carQoS0_3', { qos: 0 }, function (error) {
        if (error) {
            console.error('Subscriber3 failed to subscribe to carQoS0_3 topic', error);
        } else {
            console.log('Subscriber3 subscribed to carQoS0_3 topic');
        }
    });
})

QoS0_subscriber3.on('message', async function (topic, message) {
    const work = JSON.parse(message);
    await write_car_data(work.ID, work.data);
    QoS0_subscriber3.publish('done_carQoS0_3', 'car_QoS0_3 finish', { qos: 0 }, (error) => {
        if (error) {
            console.error('===== Failed to publish finish message to QoS0 =====', error);
        } else {
            console.log('===== Finish message published to QoS0 =====');
        }
    })
});