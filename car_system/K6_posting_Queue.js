import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    vus: 20, // 虛擬使用者數量
    duration: '2s', // 測試持續時間
};

let i=0;
export default function () {
    const data = [];
    const num = i;
    const new_data = {
        ID: `well, ${num}`,
        event: `早安現在星期一, ${num}`,
    };
    data.push(new_data);
    const responses = data.map(item =>
        http.post('http://localhost:8080/api/car/Data/Queue', JSON.stringify(item), {
        headers: {
            'Content-Type': 'application/json',
        },
        })
    );

    responses.forEach(response => {
        if (response.status === 200) {
            // const receivedID = response.json().ID;
            // const receivedData = response.json().data;
            console.log('ID insert successfully:', response.json().ID);
            console.log('Event insert successfully:', response.json().data);

            // 比較傳入的資料與回傳的資料是否相同
            // if (new_data.ID === receivedID && JSON.stringify(new_data.event) === JSON.stringify(receivedData)) {
            //     console.log('Data match!');
            // } else {
            //     console.error('Data mismatch!', JSON.stringify(new_data.event), JSON.stringify(receivedData));
            // }
        } else {
            console.error('Error ID inserting:', response.error);
        }
    });

    i++;
    // 休眠一段時間，模擬用戶之間的延遲
    sleep(1); // 休眠1秒
}