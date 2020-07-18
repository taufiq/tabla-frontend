import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import socket from './socket'
import LayerHelper from './helpers/layer'

function App() {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currPainterId, setCurrPainterId] = useState(0)

  useEffect(() => {
    socket.on('out paint', (line) => {
      const { id, pos } = line
      const lineToAddPointsTo = LayerHelper.getLineByIdFrom(layerRef.current, id)
      LayerHelper.addPointTo(lineToAddPointsTo, pos)
      layerRef.current.draw()
    })

    socket.on('new line', (line) => {
      const newLine = new Konva.Line(line)
      layerRef.current.add(newLine)
    })
  }, [])

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
            socket.emit('new line', { ...line.toObject(), id: line._id })
            setCurrPainterId(line._id)
            layerRef.current.add(line);
          }}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseMove={({ evt: moveEvent }) => {
            if (isMouseDown) {
              const moveEventPosition = [moveEvent.layerX, moveEvent.layerY]
              socket.emit('paint', { id: currPainterId, pos: moveEventPosition })
              const line = LayerHelper.getLineByIdFrom(layerRef.current, currPainterId) // TODO: dont find current line id everytime mouse is moved, cache it
              LayerHelper.addPointTo(line, moveEventPosition)
              layerRef.current.draw()
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
