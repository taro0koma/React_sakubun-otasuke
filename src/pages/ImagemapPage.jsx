import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Line } from 'react-svg-draw';

function ImagemapPage() {
  const [boxes, setBoxes] = useState([]);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startBox, setStartBox] = useState(null);
  const [currentLine, setCurrentLine] = useState(null);
  const [isResizing, setIsResizing] = useState(false); // Resize状態を管理
  const [selectedBoxId, setSelectedBoxId] = useState(null); // 選択したボックスのID
  const containerRef = useRef(null);

  const defaultBoxWidth = 100;
  const defaultBoxHeight = 50;
  const placeholderText = '入力してね';

  const addBox = () => {
    const containerRect = containerRef.current.getBoundingClientRect();
    
    let x, y;
    let found = false;
    while (!found) {
      x = Math.random() * (containerRect.width - defaultBoxWidth);
      y = Math.random() * (containerRect.height - defaultBoxHeight);

      found = !boxes.some(box => {
        const boxRect = {
          left: box.x,
          top: box.y,
          right: box.x + box.width,
          bottom: box.y + box.height,
        };
        const newBoxRect = {
          left: x,
          top: y,
          right: x + defaultBoxWidth,
          bottom: y + defaultBoxHeight,
        };
        return !(newBoxRect.right < boxRect.left || 
                 newBoxRect.left > boxRect.right || 
                 newBoxRect.bottom < boxRect.top || 
                 newBoxRect.top > boxRect.bottom);
      });
    }

    setBoxes([...boxes, { id: boxes.length, x, y, width: defaultBoxWidth, height: defaultBoxHeight, text: '' }]);
  };

  const startLine = (box, e) => {
    setIsDrawing(true);
    setStartBox(box);
    const containerRect = containerRef.current.getBoundingClientRect();
    setCurrentLine({
      x1: e.clientX - containerRect.left,
      y1: e.clientY - containerRect.top,
      x2: e.clientX - containerRect.left,
      y2: e.clientY - containerRect.top,
    });
  };

  const updateLine = (e) => {
    if (isDrawing) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setCurrentLine({
        ...currentLine,
        x2: e.clientX - containerRect.left,
        y2: e.clientY - containerRect.top,
      });
    }
  };

  const finishLine = (box) => {
    if (isDrawing && box && box !== startBox) {
      setLines([...lines, {
        x1: startBox.x + startBox.width / 2,
        y1: startBox.y + startBox.height / 2,
        x2: box.x + box.width / 2,
        y2: box.y + box.height / 2,
      }]);
    }
    setIsDrawing(false);
    setCurrentLine(null);
  };

  const handleResizeStart = () => {
    setIsResizing(true); // Resize開始時に設定
  };

  const handleResizeStop = (id, e) => {
    setIsResizing(false); // Resize終了時に設定
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, width: e.target.style.width.replace('px', ''), height: e.target.style.height.replace('px', '') } : box
    ));
  };

  const handleBoxChange = (id, newText) => {
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, text: newText } : box
    ));
  };

  const handleInput = (id, e) => {
    const text = e.target.innerText.trim();
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, text: text } : box
    ));
  };

  const handleFocus = (id) => {
    setSelectedBoxId(id);
    const box = boxes.find(box => box.id === id);
    if (box && box.text === placeholderText) {
      // テキストがプレースホルダーの場合はクリア
      setBoxes(boxes.map(box =>
        box.id === id ? { ...box, text: '' } : box
      ));
    }
  };

  const handleBlur = (id) => {
    const box = boxes.find(box => box.id === id);
    if (box && box.text === '') {
      setBoxes(boxes.map(box =>
        box.id === id ? { ...box, text: placeholderText } : box
      ));
    }
  };

  const increaseBoxSize = () => {
    if (selectedBoxId !== null) {
      setBoxes(boxes.map(box =>
        box.id === selectedBoxId ? { ...box, width: box.width + 10, height: box.height + 10 } : box
      ));
    }
  };

  const decreaseBoxSize = () => {
    if (selectedBoxId !== null) {
      setBoxes(boxes.map(box =>
        box.id === selectedBoxId ? { ...box, width: Math.max(box.width - 10, 10), height: Math.max(box.height - 10, 10) } : box
      ));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={updateLine}
      style={{ position: 'relative', height: '100vh', width: '100vw', border: '1px solid black', overflow: 'hidden' }}
    >
      <button onClick={addBox} style={{ marginBottom: '10px' }}>Add Box</button>
      <button onClick={increaseBoxSize} style={{ marginBottom: '10px' }}>Increase Size</button>
      <button onClick={decreaseBoxSize} style={{ marginBottom: '10px' }}>Decrease Size</button>
      <svg style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}>
        {lines.map((line, index) => (
          <Line key={index} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="black" />
        ))}
        {currentLine && (
          <Line x1={currentLine.x1} y1={currentLine.y1} x2={currentLine.x2} y2={currentLine.y2} stroke="black" />
        )}
      </svg>
      {boxes.map(box => (
        <Draggable
          key={box.id}
          defaultPosition={{ x: box.x, y: box.y }}
          bounds="parent"
          disabled={isResizing} // リサイズ中はドラッグを無効にする
          onStop={(e, data) => {
            setBoxes(boxes.map(b =>
              b.id === box.id ? { ...b, x: data.x, y: data.y } : b
            ));
          }}
        >
          <div
            contentEditable
            suppressContentEditableWarning
            style={{
              width: `${box.width}px`,
              height: `${box.height}px`,
              backgroundColor: 'lightgray',
              textAlign: 'center',
              lineHeight: '1.2em',
              border: '1px solid black',
              position: 'absolute',
              zIndex: 2,
              cursor: 'pointer',
              userSelect: 'text',
              overflow: 'hidden',
              padding: '4px',
              boxSizing: 'border-box',
              resize: 'both', // 縦横比を自由に変更できるようにする
            }}
            data-id={box.id} // ID属性を追加
            onMouseDown={(e) => startLine(box, e)}
            onMouseUp={() => finishLine(box)}
            onResizeStart={handleResizeStart} // リサイズ開始時に呼び出す
            onResizeStop={(e) => handleResizeStop(box.id, e)} // リサイズ終了時に呼び出す
            onInput={(e) => handleInput(box.id, e)}
            onFocus={() => handleFocus(box.id)}
            onBlur={() => handleBlur(box.id)}
          >
            {box.text === placeholderText ? (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'gray',
                  pointerEvents: 'none',
                }}
              >
                {placeholderText}
              </div>
            ) : (
              <div
                style={{
                  overflowWrap: 'break-word', // 文字を折り返す
                  whiteSpace: 'normal', // 折り返しを有効にする
                }}
              >
                {box.text}
              </div>
            )}
          </div>
        </Draggable>
      ))}
    </div>
  );
}

export default ImagemapPage;
