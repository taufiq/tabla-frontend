import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
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
  const [isPainting, setIsPainting] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello</h1>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          ref={stageRef}
          onMouseDown={() => {
            setIsPainting(true);
            const startingPos = stageRef.current.getPointerPosition();
            const line = new Konva.Line({
              stroke: "white",
              strokeWidth: 5,
              globalCompositeOperation: 'source-over', // TODO: find out what this is
              points: [startingPos.x, startingPos.y],
            });
            layerRef.current.add(line);
          }}
          onMouseUp={() => setIsPainting(false)}
          onMouseMove={({ evt }) => {
            if (isPainting) {
              const line = layerRef.current.children[1] // TODO: refer to new line everytime mouse is downed and not to 1 single line
              const newPoints = line.points().concat([evt.layerX, evt.layerY])
              line.points(newPoints)
              layerRef.current.batchDraw()
            }
          }}
        >
          <Layer ref={layerRef}>
            <ColoredRect />
          </Layer>
        </Stage>
      </header>
    </div>
  );
}

export default App;
