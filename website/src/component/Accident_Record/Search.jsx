import Item from "./Item";
import "./App.css";
import { useState } from "react";

const List = (props) => {
  function close() {
    props.setSearchTrigger(false);
    setListTrigger(false);
  }

  const [ListTrigger, setListTrigger] = useState(false);

  return props.trigger ? (
    <div>
      <p>請輸入要查詢的ID:</p>
      <input type="text" placeholder="Car ID" className="inputStyle" />
      <button className="search" onClick={() => setListTrigger(true)}>
        Search
      </button>
      {ListTrigger ? (
        <div className="list">
          {props.listData.map((item) => {
            const { ID, event, id } = item;
            return <Item key={id} ID={ID} event={event} />;
          })}
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
