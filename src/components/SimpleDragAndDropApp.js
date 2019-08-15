import React from "react";

class DropContainer extends React.Component {
  constructor(props) {
    // console.log("Creating component " + props.id);
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);

    this.state = {
      focusDropContainer: false
    };
  }

  onDragOver(e) {
    // console.log("DropContainer:onDragOver");
    e.preventDefault(); // activate drop zone **IMPORTANT**
  }

  onDrop(e) {
    // console.log("DropContainer:onDrop");
    this.props.onDrop(e);
  }

  onDragEnter() {
    // console.log("DropContainer:onDragEnter");
    // add: drag focus style
    this.setState({ ...this.state, focusDropContainer: true });
  }
  onDragLeave() {
    // console.log("DragContainer:onDragLeave");
    // remove: drag focus style
    this.setState({ ...this.state, focusDropContainer: false });
  }

  render() {
    // console.log("DropContainer:render this.props.items", this.props.items);
    const focused = this.state.focusDropContainer ? "drag-enter" : "";
    return (
      <div
        id={this.props.id}
        key={this.props.id}
        className={"drag-and-drop-wrapper " + focused}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={e => this.onDragLeave(e)}
      >
        {this.props.items.map(item => (
          <DragableItem key={item.id} item={item} />
        ))}
      </div>
    );
  }
}

const DragContainer = props => {
  return (
    <div id={props.id} key={props.id} className={"drag-and-drop-wrapper "}>
      {props.items.map(item => (
        <DragableItem key={item.id} item={item} />
      ))}
    </div>
  );
};

const DragableItem = ({ item }) => {
  const onDragStart = e => {
    // e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.setData("dragedItem", JSON.stringify(item));
    e.dropEffect = "move";
  };
  return (
    <div key={item.id} id={item.id} className={"row"} draggable={true} onDragStart={onDragStart}>
      <span>||| </span> {item.name}
    </div>
  );
};

class SimpleDragAndDropApp extends React.Component {
  initialState = {
    items1: [
      { id: 1, name: "One" },
      { id: 2, name: "Two" },
      { id: 3, name: "Three" },
      { id: 4, name: "Four" },
      { id: 5, name: "Five" }
    ],
    items2: [],
    focusDropContainer: false
  };
  constructor(props) {
    super(props);
    this.init();
    this.state = this.initialState;
    this.onDrop = this.onDrop.bind(this);

    this.moveElement = this.moveElement.bind(this);
  }

  init() {
    require("./DragAndDropApp.css");
  }

  onDrop(e) {
    // console.log("SimpleDragAndDropApp:onDrop");
    e.preventDefault();
    // const elementId = e.dataTransfer.getData("text/plain");
    // // console.log(elementId);
    const item = JSON.parse(e.dataTransfer.getData("dragedItem"));
    // console.log(item);
    this.moveElement(item);
  }

  moveElement(draggedItem) {
    // REMOVE: dragged item from 'items1'
    const sourceItems = this.state.items1.filter(item => item.id !== draggedItem.id);
    // ADD: dragged item to 'items2'
    const targetItems = [...this.state.items2, draggedItem];
    this.setState(state => ({
      items1: sourceItems,
      items2: targetItems
    }));
  }

  render() {
    return (
      <>
        <div className="wrapper">
          <div style={{ display: "inline-block" }}>
            <DragContainer items={this.state.items1} id={"items1"} />
            <DropContainer items={this.state.items2} id={"items2"} onDrop={this.onDrop} />
          </div>
          <div>
            <pre>{JSON.stringify(this.state, null, 1)}</pre>
          </div>
        </div>
      </>
    );
  }
}

export default SimpleDragAndDropApp;
