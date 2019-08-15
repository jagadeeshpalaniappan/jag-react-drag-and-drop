import React from "react";

class DragAndDropContainer extends React.Component {
  constructor(props) {
    // console.log("Creating component " + props.id);
    super(props);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  onDragOver(e) {
    // console.log("DragAndDropContainer:onDragOver");
    this.props.onDragOver(e, this.props.id);
  }

  onDragEnter(e) {
    // console.log("DragAndDropContainer:onDragEnter");
    this.props.onDragEnter(e, this.props.id);
  }

  onDragLeave(e) {
    // console.log("DragAndDropContainer:onDragLeave");
    if (e.target.id === this.props.id) {
      this.props.onDragLeave(e, this.props.id);
    }
  }

  onDragExit(e) {}

  onDragStart(e) {
    // console.log("DragAndDropContainer:onDragStart");
    this.props.onDragStart(this.props.id);
  }

  onDragEnd(e) {
    // console.log("DragAndDropContainer:onDragEnd");
    // console.log("onDragEnd");
    this.props.onDragEnd();
  }

  onDrop(e) {
    // console.log("DragAndDropContainer:onDrop");
    this.props.onDrop(e);
  }

  render() {
    // console.log("DragAndDropContainer:render this.props.items", this.props.items);
    const focused = this.props.isDragTarget(this.props.id) ? "drag-enter" : "";
    return (
      <div
        id={this.props.id}
        key={this.props.id}
        className={"drag-and-drop-wrapper " + focused}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragEnter={this.onDragEnter}
        onDragLeave={e => this.onDragLeave(e)}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
      >
        {this.props.items.map(item => (
          <DragableItem key={item.id} item={item} />
        ))}
      </div>
    );
  }
}

const DragableItem = ({ item }) => {
  const onDragStart = e => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.setData("dragedItem", JSON.stringify(item));
    e.dropEffect = "move";
  };
  return (
    <div key={item.id} id={item.id} className={"row"} draggable={true} onDragStart={onDragStart}>
      <span className={"drag"}>||| </span> {item.name}
    </div>
  );
};

class TwoWayDragAndDropApp extends React.Component {
  initialState = {
    items1: [
      { id: 1, name: "One" },
      { id: 2, name: "Two" },
      { id: 3, name: "Three" },
      { id: 4, name: "Four" }
    ],
    items2: [],
    dragSource: null,
    dragTarget: null
  };
  constructor(props) {
    super(props);
    this.init();
    this.state = this.initialState;
    this.onDrop = this.onDrop.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragExit = this.onDragExit.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.isDragSource = this.isDragSource.bind(this);
    this.isValidDragTarget = this.isValidDragTarget.bind(this);
    this.isDragTarget = this.isDragTarget.bind(this);
    this.moveElement = this.moveElement.bind(this);
  }

  init() {
    require("./DragAndDropApp.css");
  }

  onDrop(e) {
    // console.log("TwoWayDragAndDropApp:onDrop");
    // if (this.isValidDragTarget(this.state.dragTarget)) {
    e.preventDefault();
    const elementId = e.dataTransfer.getData("text/plain");
    // console.log(elementId);
    const item = JSON.parse(e.dataTransfer.getData("dragedItem"));
    this.moveElement(item);
    // }
  }

  moveElement(draggedItem) {
    const sourceElements = this.state[this.state.dragSource].filter(
      item => item.id !== draggedItem.id
    );
    // console.log(sourceElements);
    // console.log(this.state[this.state.dragSource]);
    // console.log(this.state[this.state.dragTarget]);

    this.setState(state => ({
      [this.state.dragSource]: sourceElements,
      [this.state.dragTarget]: [...state[this.state.dragTarget], draggedItem],

      dragSource: null,
      dragTarget: null
    }));
  }

  onDragStart(source) {
    // console.log("TwoWayDragAndDropApp:onDragStart");
    this.setState({ dragSource: source });
  }

  onDragEnter(e, id) {
    // console.log("TwoWayDragAndDropApp:onDragEnter");
    if (this.isValidDragTarget(id)) {
      // console.log("set target: " + id);
      this.setState({ dragTarget: id });
    }
  }

  onDragOver(e, id) {
    // console.log("TwoWayDragAndDropApp:onDragOver");
    if (this.isDragTarget(id)) {
      e.preventDefault(); // activate drop zone
    }
  }

  onDragLeave(e, id) {
    // console.log("TwoWayDragAndDropApp:onDragLeave");
    if (id === this.state.dragTarget) {
      this.setState({ dragTarget: null });
    }
  }

  onDragExit() {}

  onDragEnd() {
    // console.log("TwoWayDragAndDropApp:onDragEnd");
    // this.setState({ dragSource: null, dragTarget: null });
  }

  isValidDragTarget(id) {
    return id !== this.state.dragSource;
  }

  isDragTarget(id) {
    return id === this.state.dragTarget && this.state.dragTarget !== null;
  }

  isDragSource(id) {
    return id === this.state.dragSource;
  }

  render() {
    return (
      <>
        <div className="wrapper">
          <div style={{ display: "inline-block" }}>
            <DragAndDropContainer
              items={this.state.items1}
              id={"items1"}
              onDrop={this.onDrop}
              onDragStart={this.onDragStart}
              onDragEnter={this.onDragEnter}
              onDragOver={this.onDragOver}
              onDragLeave={this.onDragLeave}
              onDragExit={this.onDragExit}
              onDragEnd={this.onDragEnd}
              isDragTarget={this.isDragTarget}
              isDragSource={this.isDragSource}
            />
            <DragAndDropContainer
              items={this.state.items2}
              id={"items2"}
              onDrop={this.onDrop}
              onDragStart={this.onDragStart}
              onDragEnter={this.onDragEnter}
              onDragOver={this.onDragOver}
              onDragLeave={this.onDragLeave}
              onDragExit={this.onDragExit}
              onDragEnd={this.onDragEnd}
              isDragTarget={this.isDragTarget}
              isDragSource={this.isDragSource}
            />
          </div>
          <div>
            <pre>{JSON.stringify(this.state, null, 1)}</pre>
          </div>
        </div>
      </>
    );
  }
}

export default TwoWayDragAndDropApp;
