import { useRef, useEffect, useState, MouseEvent } from 'react';
import { FaPaintBrush } from 'react-icons/fa';
import { FaEraser } from 'react-icons/fa6';
import { VscDebugRestart } from 'react-icons/vsc';

import DrawingToolMenu from '../components/DrawingToolMenu';
import { colors } from '../constants/colors';
import { BrushStyle } from '../interfaces/brushStyle';

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const [openDrawingToolMenu, setOpenDrawingToolMenu] = useState<boolean>(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

  /*const [strokes, setStrokes] = useState<any[]>([]); 
  const [activeStroke, setActiveStroke] = useState<any>({
    colorOption: colors[0],
    strokeWidth: 10,
    points: []
  });*/
  const [brushStyle, setBrushStyle] = useState<BrushStyle>({
    color: colors[0],
    size: 10
  });

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
      contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : brushStyle.color.hex;
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
      context.lineWidth = brushStyle.size;
      contextRef.current = context;
    }
  }, [brushStyle.size]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = brushStyle.color.hex;
    };
  }, [brushStyle.color]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = tool === 'brush' ? brushStyle.size : 25;
    };
  }, [brushStyle.size, tool]);

  return (
    <div onClick={() => openDrawingToolMenu && setOpenDrawingToolMenu(false)} className='flex flex-col w-screen h-screen bg-white'>
      <div className='flex bg-purple-700 h-[5%] w-full pl-[1.5%] items-center'>
        <button 
          onClick={() => (setOpenDrawingToolMenu(!openDrawingToolMenu), setTool('brush'))} 
          style={{
            backgroundColor: tool === 'brush' ? '#F8FAFC' : 'transparent'
          }} 
          className='p-0 h-7 w-7 flex justify-center items-center rounded-full'
        >
          <FaPaintBrush 
            style={{ fill: tool === 'brush' ? brushStyle.color.hex : 'white' }}
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
            style={{ fill: tool === 'eraser' ? colors.find(option => option.name === 'purple')?.hex : 'white' }}
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
          brushStyle={brushStyle}
          setBrushStyle={setBrushStyle}
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