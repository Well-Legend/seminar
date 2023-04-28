import axios from "axios";


axios.post('http://localhost:8080/api/ID',{ ID: "well" })
  .then(response => {
    console.log('ID insert successfully:', response.data);
  })
  .catch(error => {
    console.error('Error ID inserting:', error);
  });
