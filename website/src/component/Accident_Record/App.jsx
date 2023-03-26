import { useState, useEffect, useRef } from "react";
import "./App.css";
import Write_data from "./Write.jsx";
import List from "./Search.jsx";



const Home = () => {
  const [data, setData] = useState([]);
  const [WriteTrigger, setWriteTrigger] = useState(false);
  const submittingStatus = useRef(false);

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
