import { useRef, useEffect, useState } from 'react';
import { FaPaintBrush } from 'react-icons/fa';
import { FaEraser } from 'react-icons/fa6';
import { VscDebugRestart } from 'react-icons/vsc';

import DrawingToolMenu from '../components/DrawingToolMenu';
import { ColorOption } from '../interfaces/colorOption';

const DrawingCanvas = () => {
  const canvasRef: any = useRef(null);
  const contextRef: any = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [openDrawingToolMenu, setOpenDrawingToolMenu] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [brushSize, setBrushSize] = useState(10);
  const colorOptions: ColorOption[] = [
    { color: "red", tailwind: "red-500", hex: "#ef4444", sound: new Audio('/assets/sounds/green.wav') },
    { color: "orange", tailwind: "orange-500", hex: "#f97316", sound: new Audio('/assets/sounds/green.wav') },
    { color: "yellow", tailwind: "yellow-500", hex: "#eab308", sound: new Audio('/assets/sounds/green.wav') },
    { color: "green", tailwind: "green-500", hex: "#22c55e", sound: new Audio('/assets/sounds/green.wav') },
    { color: "blue", tailwind: "blue-500", hex: "#3b82f6", sound: new Audio('/assets/sounds/green.wav') },
    { color: "pink", tailwind: "pink-500", hex: "#ec4899", sound: new Audio('/assets/sounds/green.wav') },
    { color: "purple", tailwind: "purple-500", hex: "#a855f7", sound: new Audio('/assets/sounds/green.wav') },
  ];
  const [color, setColor] = useState(colorOptions[0]);

  const startDrawing = (event: any) => {
    event.preventDefault(); // Evita o comportamento de rolagem
    const touch = event.touches ? event.touches[0] : event;
    const { offsetX, offsetY } = getOffset(touch);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (event: any) => {
    event.preventDefault();
    if (!isDrawing) return;

    const touch = event.touches ? event.touches[0] : event;
    const { offsetX, offsetY } = getOffset(touch);

    contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const getOffset = (touch: any) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * 0.95 * scale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight * 0.95}px`;

    const context = canvas.getContext("2d");
    context.scale(scale, scale);
    context.lineCap = "round";
    context.lineWidth = brushSize;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color.hex;
    }
  }, [color]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = tool === 'pencil' ? brushSize : 25;
    }
  }, [brushSize, tool]);

  return (
    <div onClick={() => openDrawingToolMenu && setOpenDrawingToolMenu(false)} className='flex flex-col w-screen h-screen bg-white'>
      <div className='flex bg-purple-700 h-[5%] w-full pl-[1.5%] items-center'>
        <button 
          onClick={() => (setOpenDrawingToolMenu(!openDrawingToolMenu), setTool('pencil'))} 
          style={{
            backgroundColor: tool === 'pencil' ? '#F8FAFC' : 'transparent'
          }} 
          className={`p-0 h-7 w-7 flex justify-center items-center rounded-full`}
        >
          <FaPaintBrush 
            style={{ fill: tool === 'pencil' ? color.hex : 'white' }}
            className={'size-[60%]'}
          />
        </button>
        <button 
          onClick={() => setTool('eraser')} 
          style={{
            backgroundColor: tool === 'eraser' ? '#F8FAFC' : 'transparent'
          }} 
          className={`p-0 h-7 w-7 flex justify-center items-center rounded-full ml-[0.7%]`}
        >
          <FaEraser 
            style={{ fill: tool === 'eraser' ? '#7E22CE' : 'white' }}
            className={'size-[75%]'} 
          />
        </button>
        <button 
          onClick={clearCanvas} 
          className='p-0 flex justify-center items-center bg-transparent ml-[0.6%] h-full'
        >
          <VscDebugRestart className='fill-white size-[80%]' />
        </button>
      </div>
      {openDrawingToolMenu &&
        <DrawingToolMenu
          colorOptions={colorOptions}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          setColor={setColor}
        />
      }
      <canvas
        ref={canvasRef}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={finishDrawing}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        className='h-[95%] w-full'
      />
      <button
        className='absolute right-12 bottom-8 bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-200'
      >
        Gerar Música
      </button>
    </div>
  );
};

export default DrawingCanvas;
