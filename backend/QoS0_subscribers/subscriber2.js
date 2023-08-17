const mqtt = require('mqtt');
const write_car_data = require("../routes/car/write_data.js");

const QoS0_subscriber2 = mqtt.connect(null, {clientId: 'QoS0_subscriber2'});

QoS0_subscriber2.on('connect', function(){
    console.log('Subscriber2 connected to MQTT broker');
    QoS0_subscriber2.subscribe('carQoS0_2', { qos: 0 }, function (error) {
        if (error) {
            console.error('Subscriber2 failed to subscribe to carQoS0_2 topic', error);
        } else {
            console.log('Subscriber2 subscribed to carQoS0_2 topic');
        }
    });
})

QoS0_subscriber2.on('message', async function (topic, message) {
    const work = JSON.parse(message);
    await write_car_data(work.ID, work.data);
    QoS0_subscriber2.publish('done_carQoS0_2', 'car_QoS0_2 finish', { qos: 0 }, (error) => {
        if (error) {
            console.error('===== Failed to publish finish message to QoS0 =====', error);
        } else {
            console.log('===== Finish message published to QoS0 =====');
        }
    })
});