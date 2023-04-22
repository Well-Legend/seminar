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
    axios.get('http://localhost:8080/api/data', { params: data })
    .then(response => {
      const resultDiv = document.getElementById('result');
      const data = response.data;
      const rows = data.split('<br>')
        .filter(row => row.trim() !== '') // 去除空白的行
        .map(row => {
          const [Data, timestamp] = row.split(',');
          return { Data, timestamp };
        });
      resultDiv.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                <td>${row.Data}</td>
                <td>${row.timestamp}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
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
        <div className="list" id="result"></div>
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
