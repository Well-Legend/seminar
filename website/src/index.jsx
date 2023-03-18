import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./component/Accident_Record/App";

function Progress() {
  const barwidth = "75%";
  return (
    <div>
      <div
        className="progress-back"
        style={{
          backgroundColor: "rgba(0,0,0,0.2)",
          width: "200px",
          height: "7px",
          borderRadius: "10px",
        }}
      >
        <div
          className="progress-bar"
          style={{
            backgroundColor: "#fe5196",
            width: barwidth,
            height: "100%",
            borderRadius: "10px",
          }}
        ></div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div>
      <Home />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
