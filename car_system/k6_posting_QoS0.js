import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    scenarios: {
        contacts: {
            executor: 'per-vu-iterations',
            vus: 100,
            iterations: 5,
        }
    }
};

let i=0;
export default function () {
    var timestamp = Date.now();
    const new_data = {
        ID: `well, ${i}`,
        event: `早安現在星期一, ${i}`,
        timestamp: timestamp
    };    
    
    const response = http.post('http://localhost:8080/api/car/Data/QoS0', JSON.stringify(new_data), {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: '20m',
    })

    i++;
    if (response.status === 200) {
        console.log(response.json());
    } else {
        console.error('Error ID inserting:', response.error);
    }


    // 休眠一段時間，模擬用戶之間的延遲
    // sleep(1); // 休眠1秒
}
