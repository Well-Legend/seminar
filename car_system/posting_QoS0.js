import axios from "axios";

const data = [];
for(let i=0;i<3;i++){
  const new_data = {
    ID: "well",
    event: `早安現在星期一 ${i + 1}`
  };
  data.push(new_data);
}

const requests = data.map(item =>
  axios.post('http://localhost:8080/api/car/Data/QoS0', item)
  .then(response => {
    console.log('ID insert successfully:', response.data.ID);
    console.log('Event insert successfully:', response.data.data);
  })
  .catch(error => {
    console.error('Error ID inserting:', error);
  })
);

Promise.all(requests).then(() => {
  console.log('All requests completed successfully');
})
.catch(error => {
  console.error('Error occurred:', error);
})