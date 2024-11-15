import { useRef, useEffect, useState, MouseEvent, TouchEvent } from 'react';
import { FaPaintBrush } from 'react-icons/fa';
import { FaEraser } from 'react-icons/fa6';
import { VscDebugRestart } from 'react-icons/vsc';

import DrawingToolMenu from '../components/DrawingToolMenu';
import { ColorOption } from '../interfaces/colorOption';
import { colorOptions } from '../constants/colorOptions';

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const [openDrawingToolMenu, setOpenDrawingToolMenu] = useState<boolean>(false);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [color, setColor] = useState<ColorOption>(colorOptions[0]);

  const startDrawing = (event: any) => {
    event.preventDefault();
    const touch = 'touches' in event ? event.touches[0] : event;
    const { offsetX, offsetY } = getOffset(touch);
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const draw = (event: any) => {
    event.preventDefault();
    if (!isDrawing) return;

    const touch = 'touches' in event ? event.touches[0] : event;
    const { offsetX, offsetY } = getOffset(touch);

    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color.hex;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    };
  };

  const getOffset = (touch: MouseEvent | Touch): { offsetX: number; offsetY: number } => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found');
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * 0.95 * scale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight * 0.95}px`;

    const context = canvas.getContext("2d");
    if (context) {
      context.scale(scale, scale);
      context.lineCap = "round";
      context.lineWidth = brushSize;
      contextRef.current = context;
    }
  }, [brushSize]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color.hex;
    };
  }, [color]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = tool === 'pencil' ? brushSize : 25;
    };
  }, [brushSize, tool]);

  return (
    <div onClick={() => openDrawingToolMenu && setOpenDrawingToolMenu(false)} className='flex flex-col w-screen h-screen bg-white'>
      <div className='flex bg-purple-700 h-[5%] w-full pl-[1.5%] items-center'>
        <button 
          onClick={() => (setOpenDrawingToolMenu(!openDrawingToolMenu), setTool('pencil'))} 
          style={{
            backgroundColor: tool === 'pencil' ? '#F8FAFC' : 'transparent'
          }} 
          className='p-0 h-7 w-7 flex justify-center items-center rounded-full'
        >
          <FaPaintBrush 
            style={{ fill: tool === 'pencil' ? color.hex : 'white' }}
            className='size-[60%]'
          />
        </button>
        <button 
          onClick={() => setTool('eraser')} 
          style={{
            backgroundColor: tool === 'eraser' ? '#F8FAFC' : 'transparent'
          }} 
          className='p-0 h-7 w-7 flex justify-center items-center rounded-full ml-[0.7%]'
        >
          <FaEraser 
            style={{ fill: tool === 'eraser' ? colorOptions.find(option => option.color === 'purple')?.hex : 'white' }}
            className='size-[75%]' 
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