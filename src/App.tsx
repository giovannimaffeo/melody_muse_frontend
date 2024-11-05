import React, { useRef, useEffect, useState } from 'react';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000")

  useEffect(() => {
    const canvas = canvasRef.current;

    // Define a escala de acordo com a densidade de pixels
    const scale = window.devicePixelRatio || 1;

    // Ajuste de largura e altura com base na escala
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // Configuração do contexto considerando a escala
    const context = canvas.getContext("2d");
    context.scale(scale, scale);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const handleColorChange = (event) => {
    console.log(event.target.value)
    setColor(event.target.value);
  }

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  }, [color]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing} // Para parar de desenhar se o mouse sair do canvas
        style={{ border: "1px solid black" }}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => console.log("test")}>teste</button>
        <label>Escolha a cor do pincel: </label>
        <input type="color" value={color} onChange={handleColorChange} />
      </div>
    </div>
  );
};

export default DrawingCanvas;
