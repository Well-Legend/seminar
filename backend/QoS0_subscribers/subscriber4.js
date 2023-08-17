const mqtt = require('mqtt');
const write_car_data = require("../routes/car/write_data.js");

const QoS0_subscriber4 = mqtt.connect(null, {clientId: 'QoS0_subscriber4'});

QoS0_subscriber4.on('connect', function(){
    console.log('Subscriber4 connected to MQTT broker');
    QoS0_subscriber4.subscribe('carQoS0_4', { qos: 0 }, function (error) {
        if (error) {
            console.error('Subscriber4 failed to subscribe to carQoS0_4 topic', error);
        } else {
            console.log('Subscriber4 subscribed to carQoS0_4 topic');
        }
    });
})

QoS0_subscriber4.on('message', async function (topic, message) {
    const work = JSON.parse(message);
    await write_car_data(work.ID, work.data);
    QoS0_subscriber4.publish('done_carQoS0_4', 'car_QoS0_4 finish', { qos: 0 }, (error) => {
        if (error) {
            console.error('===== Failed to publish finish message to QoS0 =====', error);
        } else {
            console.log('===== Finish message published to QoS0 =====');
        }
    })
});