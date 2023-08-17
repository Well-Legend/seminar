import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1, // 虚拟用户数
  iterations: 1, // 每个用户发送次数
  duration: '60m', // 总共持续时间
};

let i=0;
export default function () {
    const new_data = {
        ID: `well, ${i}`,
        event: `早安現在星期一, ${i}`,
    };   
    let response = null; 
    // if(i==1){
        response = http.post('http://localhost:8080/api/car/Data', JSON.stringify(new_data), {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: '20m',
        })
    // }
    // else if(i==0){
    //     response = http.post('http://localhost:8080/api/car/Data/Queue2', JSON.stringify(new_data), {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         timeout: '20m',
    //     })
    // }
    // else{
    //     response = http.post('http://localhost:8080/api/car/Data/Queue3', JSON.stringify(new_data), {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         timeout: '20m',
    //     })  
    // }
    if (response.status === 200) {
        i++;
        console.log(response.json());
    } else {
        console.error('Error ID inserting:', response.error);
        i++;
    }


    // 休眠一段時間，模擬用戶之間的延遲
    //  sleep(1); // 休眠1秒
}
