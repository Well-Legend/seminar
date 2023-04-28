import axios from "axios";

axios.post('http://localhost:8080/api/Data', {event: "yoyo"})
  .then(response => {
    console.log('Event insert successfully:', response.data);
  })
  .catch(error => {
    console.error('Error event inserting:', error);
  });