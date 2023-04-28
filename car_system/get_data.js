import axios from "axios";

const car = {carID: "well"};
axios.get('http://localhost:8080/api/data', { params: car})
  .then(response => {
    console.log("The Datas are: ", JSON.stringify(response.data));
    })
  .catch(error => {
    console.error('Error event getting:', error);
  });
