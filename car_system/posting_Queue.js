import axios from "axios";

const data = [];
const new_data = {
    ID: "well",
    event: "早安現在星期一"
};
data.push(new_data);


const requests = data.map(item =>
  axios.post('http://localhost:8080/api/car/Data', item)
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