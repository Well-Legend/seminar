const mqtt = require('mqtt');
const write_car_data = require("../routes/car/write_data.js");

const options = {
    clientId: 'QoS0_subscriber1', 
    connectTimeout: 600*1000,
    // keepalive: 600
}
const QoS0_subscriber1 = mqtt.connect(null, options);

QoS0_subscriber1.on('connect', function () {
    console.log('Subscriber1 connected to MQTT broker');
    QoS0_subscriber1.subscribe('carQoS0_1', { qos: 0 }, function (error) {
        if (error) {
            console.error('Subscriber1 failed to subscribe to carQoS0_1 topic', error);
        } else {
            console.log('Subscriber1 subscribed to carQoS0_1 topic');
        }
    });
});

QoS0_subscriber1.on('message', async function (topic, message) {
        const work = JSON.parse(message);
        write_car_data(work.ID, work.data);
        // QoS0_subscriber1.publish('done_carQoS0_1', 'car_QoS0_1 finish', { qos: 0 }, (error) => {
        //     if (error) {
        //         console.error('===== Failed to publish finish message to QoS0 =====', error);
        //     } else {
        //         console.log('===== Finish message published to QoS0 =====');
        //     }
        // })
});
