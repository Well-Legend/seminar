import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    vus: 10, // 虛擬使用者數量
    iterations: 10, // 每個使用者發送次數
    duration: '60m',//總共持續時間
};

let i=0;
export default function () {
    const new_data = {
        ID: `well, ${i}`,
        event: `早安現在星期一, ${i}`,
    };    

    const response = http.post('http://localhost:8080/api/car/Data/QoS1', JSON.stringify(new_data), {
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