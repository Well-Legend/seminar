import "./App.css";
import { useState } from "react";
import { v4 } from "uuid";

const Write_data = (props) => {
  const [ID, setID] = useState("");
  function IDChange(e) {
    setID(e.target.value);
  }

  const [event, setEvent] = useState("");
  function eventChange(e) {
    setEvent(e.target.value);
  }

  function addItem() {
    if (ID!=="" && event !=="")
    {
        console.log("ID:" + ID)
        console.log("event:" + event)
        props.add(function (prevData) {
            return [
                {
                id: v4(),
                ID,
                event,
                },
                ...prevData,
            ];
        })
    }
  }

  function close() {
    props.setWriteTrigger(false);
  }

  return props.trigger ? (
    <div className="app">
      <p>輸入Car-ID： </p>
      <input placeholder="CAR ID" type="text" value={ID} onChange={IDChange} />
      <p>輸入事件： </p>
      <input
        placeholder="event"
        type="text"
        value={event}
        onChange={eventChange}
      />
      <p>
        <button className="check" onClick={addItem}>
          OK
        </button>
        <button className="close" onClick={close}>
          Close
        </button>
      </p>
    </div>
  ) : (
    ""
  );
};

export default Write_data;
