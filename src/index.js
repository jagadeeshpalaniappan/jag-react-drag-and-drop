import React from "react";
import ReactDOM from "react-dom";
import SimpleDragAndDropApp from "./components/SimpleDragAndDropApp";
import TwoWayDragAndDropApp from "./components/TwoWayDragAndDropApp";
import ListDragAndDropApp from "./components/ListDragAndDropApp";

import "./styles.css";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <div>
    <h3>SimpleDragAndDropApp</h3>
    <div style={{ display: "flex" }}>
      <SimpleDragAndDropApp />
    </div>
    <hr />
    <h3>TwoWayDragAndDropApp</h3>
    <div style={{ display: "flex" }}>
      <TwoWayDragAndDropApp />
    </div>
    <hr />
    <h3>
      Re-arrange List <span>using react-beautiful-dnd</span>
    </h3>
    <div style={{ display: "flex" }}>
      <ListDragAndDropApp />
    </div>
    <hr />
  </div>,
  rootElement
);
// ReactDOM.render(<DnDBox />, rootElement);
