import axios from "axios";

axios.post('http://localhost:8080/api/car/Data',{ ID: "well", event: "有成功嗎" })
  .then(response => {
    console.log('ID insert successfully:', response.data.ID);
    console.log('Event insert successfully:', response.data.data);
  })
  .catch(error => {
    console.error('Error ID inserting:', error);
  });