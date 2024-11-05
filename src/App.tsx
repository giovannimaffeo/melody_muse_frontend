import React, { useRef, useEffect, useState } from 'react';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
<<<<<<< Updated upstream
=======
  const [color, setColor] = useState("#FF0000");
  const [lineWidth, setLineWidth] = useState(5);
>>>>>>> Stashed changes

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
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
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

<<<<<<< Updated upstream
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseLeave={finishDrawing} // Para parar de desenhar se o mouse sair do canvas
      style={{ border: "1px solid black" }}
    />
=======
  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const handleLineWidthChange = (event) => {
    const newLineWidth = parseInt(event.target.value, 10);
    setLineWidth(newLineWidth);
    if (contextRef.current) {
      contextRef.current.lineWidth = newLineWidth;
    }
  };

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

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
        <label>Escolha a cor do pincel: </label>
        <select value={color} onChange={handleColorChange}>
          <option value="#FF0000">Vermelho</option>
          <option value="#FF7F00">Laranja</option>
          <option value="#FFFF00">Amarelo</option>
          <option value="#00FF00">Verde</option>
          <option value="#0000FF">Azul</option>
          <option value="#4B0082">Índigo</option>
          <option value="#8B00FF">Violeta</option>
        </select>
        <div style={{ marginTop: "10px" }}>
          <label>Escolha a espessura do pincel: </label>
          <input
            type="number"
            min="1"
            max="50"
            value={lineWidth}
            onChange={handleLineWidthChange}
          />
        </div>
      </div>
    </div>
>>>>>>> Stashed changes
  );
};

export default DrawingCanvas;
