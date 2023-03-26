import "./App.css";
import { useState } from "react";
import { v4 } from "uuid";
import axios from "axios";

const Write_data = (props) => {
  const [ID, setID] = useState("");
  function IDChange(e) {
    setID(e.target.value);
  }

  const [event, setEvent] = useState("");
  function eventChange(e) {
    setEvent(e.target.value);
  }

  // function addItem() {
  //   if (ID!=="" && event !=="")
  //   {
  //       console.log("ID:" + ID)
  //       console.log("event:" + event)
  //       props.submittingStatus.current = true
  //       props.add(function (prevData) {
  //           return [
  //               {
  //               id: v4(),
  //               ID,
  //               event,
  //               },
  //               ...prevData,
  //           ];
  //       })
  //   }
  // }

  function close() {
    props.setWriteTrigger(false);
  }

  const trans_ID = () => {
    if (ID!=="" && event !=="")
    {
      axios.post('http://localhost:8080/api/writeID',{ ID: ID })
        .then(response => {
          console.log('ID insert successfully:', response.data);
        })
        .catch(error => {
          console.error('Error ID inserting:', error);
        });
    }
  } 

  const trans_data  = () => {
    if (ID!=="" && event !=="")
    {
      axios.post('http://localhost:8080/api/writeData', { event: event})
      .then(response => {
        console.log('Event insert successfully:', response.data);
      })
      .catch(error => {
        console.error('Error event inserting:', error);
      });
    }
  }

  const add_all = () => {
    trans_ID();
    trans_data();
    // addItem();
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
        <button className="check" onClick={add_all}>
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
