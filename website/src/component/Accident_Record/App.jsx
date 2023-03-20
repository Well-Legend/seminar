import { useState, useEffect, useRef } from "react";
import { API_GET_DATA } from "../../global/constants"
import "./App.css";
import Write_data from "./Write.jsx";
import List from "./Search.jsx";

async function fetchData(setData) {
  const res = await fetch(API_GET_DATA)
  const  { data } = await res.json()
  setData(data)
}


async function fetchSetData(data) {
  await fetch(API_GET_DATA, {
    method: "PUT",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ data })
  })
}


const Home = () => {
  const [data, setData] = useState([]);
  const [WriteTrigger, setWriteTrigger] = useState(false);
  const submittingStatus = useRef(false);

  useEffect(() => {
    if (!submittingStatus.current){
      return
    }
    fetchSetData(data)
      .then(data => submittingStatus.current = false)
  }, [data])

  useEffect(() => {
    fetchData(setData)
  },[])

  useEffect(() => {
    window.alert("新增成功");
  }, [data]);

  const [SearchTrigger, setSearchTrigger] = useState(false);

  return (
    <div className="app">
      <h1>車聯網關鍵資料存證服務系統</h1>
      <button className="add_home" onClick={() => setWriteTrigger(true)}>
        新增
      </button>
      <Write_data
        add={setData}
        trigger={WriteTrigger}
        setWriteTrigger={setWriteTrigger}
        submittingStatus={submittingStatus}
      />
      <button className="add_home" onClick={() => setSearchTrigger(true)}>
        查看
      </button>
      <List
        listData={data}
        trigger={SearchTrigger}
        setSearchTrigger={setSearchTrigger}
        submittingStatus={submittingStatus}
      />
    </div>
  );
};

export default Home;
