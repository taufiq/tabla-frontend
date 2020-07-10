import React, { useState, useRef } from "react";
import { Stage, Layer, Rect } from "react-konva";
import Konva from "konva";
import "./App.css";

function ColoredRect() {
  const [color, setColor] = useState("green");
  return (
    <Rect
      onClick={() => setColor(Konva.Util.getRandomColor())}
      width={30}
      height={30}
      fill={color}
      draggable
    />
  );
}
function App() {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currPainterId, setCurrPainterId] = useState(0)

  return (
    <div className="App">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          ref={stageRef}
          onMouseDown={() => {
            setIsMouseDown(true);
            const startingPos = stageRef.current.getPointerPosition();
            const line = new Konva.Line({
              stroke: "red",
              strokeWidth: 5,
              globalCompositeOperation: 'source-over', // TODO: find out what this is
              points: [startingPos.x, startingPos.y],
            });
            setCurrPainterId(line._id)
            layerRef.current.add(line);
          }}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseMove={({ evt: dragEvent }) => {
            if (isMouseDown) {
              const line = layerRef.current.getChildren((node) => {
                return node._id === currPainterId
              })[0] // TODO: dont find current line id everytime mouse is moved, cache it
              const newPoints = line.points().concat([dragEvent.layerX, dragEvent.layerY])
              line.points(newPoints)
              layerRef.current.batchDraw()
            }
          }}
        >
          <Layer ref={layerRef}>
          </Layer>
        </Stage>
    </div>
  );
}

export default App;
