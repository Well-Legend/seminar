import Item from "./Item";
import "./App.css";
import { useState } from "react";
import axios from "axios";

const List = (props) => {
  function close() {
    props.setSearchTrigger(false);
    setListTrigger(false);
  }

  const [ListTrigger, setListTrigger] = useState(false);
  const [name, setname] = useState("");
  function IDChange(e) {
    setname(e.target.value);
  }

  const data = {carID: name}
  const get_data  = () => {
    axios.get('http://localhost:8080/api/read', { params: data })
    .then(response => {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = response.data;

      console.log('Event getting successfully:', JSON.stringify(response.data));
    })
    .catch(error => {
      console.error('Error event getting:', error);
    });
  }

  const search_all = () => {
    get_data();
    setListTrigger(true);
  }

  return props.trigger ? (
    <div>
      <p>請輸入要查詢的ID:</p>
      <input type="text" placeholder="Car ID" className="inputStyle" value={name} onChange={IDChange}/>
      <button className="search" onClick={search_all}>
        Search
      </button>
      {ListTrigger ? (
        <div className="list" id="result">
          {/* {props.listData.map((item) => {
            const { ID, event, id } = item;
            return <Item key={id} ID={ID} event={event} />;
          })} */}
        </div>
      ) : (
        ""
      )}
      <button className="close" onClick={close}>
        Close
      </button>
    </div>
  ) : (
    ""
  );
};

export default List;
