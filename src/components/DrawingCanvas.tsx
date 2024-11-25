import { useRef, useEffect, useState, MouseEvent } from 'react';

import DrawingToolMenu from './DrawingToolMenu';
import Header from './Header';
import { colors } from '../constants/colors';
import { BrushStyle } from '../interfaces/brushStyle';
import { eraserColor, eraserSize } from '../constants/eraser';
import { initialBrushSize } from '../constants/initialBrushSize';
import { Stroke } from '../interfaces/stroke';
import { Color } from '../interfaces/color';
import { InteractionInput } from '../interfaces/interactionInput';

interface DrawingCanvasProps {
  isFullSize?: boolean; 
};

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ isFullSize = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [openDrawingToolMenu, setOpenDrawingToolMenu] = useState<boolean>(false);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'click'>('brush');
  const [strokes, setStrokes] = useState<Stroke[]>([]); 
  const [activeStrokes, setActiveStrokes] = useState<Stroke[]>([]);
  const [brushStyle, setBrushStyle] = useState<BrushStyle>({
    color: colors[0],
    size: initialBrushSize
  });
  const [playingColors, setPlayingColors] = useState<Color[]>([]);
  const isToolBrush = tool === 'brush';

  const handleChangeTool = (tool: 'brush' | 'eraser') => {
    setTool(tool);
    isToolBrush && setOpenDrawingToolMenu(!openDrawingToolMenu);

    if (contextRef.current) {
      contextRef.current.strokeStyle = isToolBrush ? brushStyle.color.hex : eraserColor;
      contextRef.current.lineWidth = isToolBrush ? brushStyle.size : eraserSize;
    };
  };

  const handleChangeBrushStyle = <K extends keyof BrushStyle>(
    key: K, 
    value: BrushStyle[K]
  ) => {
    setBrushStyle(({
      ...brushStyle,
      [key]: value,
    }));

    if (contextRef.current) {
      if (typeof value === 'object' && 'hex' in value) {
        contextRef.current.strokeStyle = value.hex;
      } else {
        contextRef.current.lineWidth = value;
      };
    };
  };

  const formatInteractionInputs = (event: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in event) {
      return Array.from(event.touches).map((touch) => ({
        id: touch.identifier.toString(),
        clientX: touch.clientX,
        clientY: touch.clientY
      }));
    } else {
      return [{
        id: 'mouse',
        clientX: (event as MouseEvent).clientX,
        clientY: (event as MouseEvent).clientY
      }];
    };
  };

  const startDrawing: React.MouseEventHandler<HTMLCanvasElement> & React.TouchEventHandler<HTMLCanvasElement> = (event) => {
    event.preventDefault();
    let inputs = formatInteractionInputs(event);

    console.log(event)

    console.log("inputs", inputs)

    const newActiveStrokes = inputs.map((input: InteractionInput) => {
      const { offsetX, offsetY } = getOffset(input);
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(offsetX, offsetY);

      return {
        id: input.id,
        color: brushStyle.color,
        width: brushStyle.size,
        points: [{ x: offsetX, y: offsetY }]
      };
    });
    
    setActiveStrokes(newActiveStrokes);
  };

  const getOffset = (interactionInput: InteractionInput) => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found');
  
    const rect = canvas.getBoundingClientRect();   
    return {
      offsetX: (interactionInput.clientX - rect.left), 
      offsetY: (interactionInput.clientY - rect.top)
    };
  };  

  const draw: React.MouseEventHandler<HTMLCanvasElement> & React.TouchEventHandler<HTMLCanvasElement> = (event) => {
    event.preventDefault();
    const inputs = formatInteractionInputs(event); 

    const updatedStrokes = activeStrokes.map((stroke) => {
      const input = inputs.find((input: InteractionInput) => input.id === stroke.id);
      if (!input) return stroke; 
      const { offsetX, offsetY } = getOffset(input);

      const lastPoint = stroke.points[stroke.points.length - 1];
      if (contextRef.current && lastPoint) {
        contextRef.current.beginPath();
        contextRef.current.moveTo(lastPoint.x, lastPoint.y);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.lineWidth = stroke.width;
        contextRef.current.strokeStyle = stroke.color.hex;
        contextRef.current.stroke();

        const dx = offsetX - lastPoint.x;
        const dy = offsetY - lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 2) {
          const steps = Math.ceil(distance / 2);
          for (let i = 1; i <= steps; i++) {
            const x = lastPoint.x + (dx * i) / steps;
            const y = lastPoint.y + (dy * i) / steps;
            stroke.points.push({ x, y });
          };
        };

        stroke.points.push({ x: offsetX, y: offsetY });
      };

      return {
        ...stroke,
        points: [...stroke.points],
      };
    });
    setActiveStrokes(updatedStrokes);
  };  

  const calculateStrokeLengthInPixels = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return 0; 
  
    let length = 0;
  
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
  
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
  
      const distance = Math.sqrt(dx * dx + dy * dy);
      length += distance;
    };
  
    return Math.round(length); 
  };

  const finishDrawing: React.MouseEventHandler<HTMLCanvasElement> & React.TouchEventHandler<HTMLCanvasElement> = (event) => {
    event.preventDefault();
    const inputs = formatInteractionInputs(event); 
    
    let completedStrokes: Stroke[] = [];
    let completedStrokeIds: string[] = [];
    inputs.forEach((input: InteractionInput) => {
      activeStrokes.forEach((activeStroke) => {
        if (input.id === activeStroke.id) {
          const length = calculateStrokeLengthInPixels(activeStroke.points);  

          completedStrokes = [...completedStrokes, {...activeStroke, id: crypto.randomUUID(), length}];
          completedStrokeIds = [...completedStrokeIds, activeStroke.id];
        };
      });
    });

    setStrokes([...strokes, ...completedStrokes]);
    const updateActiveStrokes = activeStrokes.filter((stroke) => !completedStrokeIds.includes(stroke.id));
    setActiveStrokes(updateActiveStrokes);
  };  

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setActiveStrokes([]);
      setStrokes([]);
    };
  };

  const handleCanvasClick: React.MouseEventHandler<HTMLCanvasElement> & React.TouchEventHandler<HTMLCanvasElement> = (event) => {
    const inputs = formatInteractionInputs(event);
    const { offsetX, offsetY } = getOffset(inputs[0]);
  
    const tolerance = 5; 
    let selectedStroke;
    for (let i = 0; i < strokes.length; i++) {
      const stroke = strokes[i];
  
      for (let j = 0; j < stroke.points.length; j++) {
        const point = stroke.points[j];
  
        if (
          Math.abs(point.x - offsetX) <= tolerance &&
          Math.abs(point.y - offsetY) <= tolerance
        ) {
          selectedStroke = stroke; 
          break;
        };
      };
    };

    if (tool === 'eraser') {
      selectedStroke && eraseStroke(selectedStroke);
      selectedStroke && setStrokes(() => strokes.filter((stroke) => stroke.id !== selectedStroke.id));
    } else {
      selectedStroke && animateStrokeWithSound(selectedStroke);     
    };
  };  

  const eraseStroke = (stroke: Stroke) => {
    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.lineWidth = stroke.width + 1;
    context.strokeStyle = eraserColor; 
    
    stroke.points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    
    context.stroke();
  };  

  const drawStroke = (stroke: Stroke) => {
    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.lineWidth = stroke.width;
    context.strokeStyle = stroke.color.hex;
    stroke.points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      };
    });
    context.stroke();
  };

  const animateStrokeWithSound = (stroke: Stroke, shouldErase: boolean = true): Promise<void> => {
    return new Promise((resolve) => {
      const context = contextRef.current;
      if (!context) return resolve();
  
      const audio = stroke.color.sound;
      let currentIndex = 0;
  
      if (audio) {
        const volumeRate = 1 / 50;
        audio.volume = stroke.width * volumeRate;
        audio.currentTime = 0;
        audio.play();
      }
  
      const drawStep = () => {
        if (currentIndex >= stroke.points.length - 1) {
          if (audio) audio.pause();
          if (shouldErase) {
            eraseStroke(stroke);
            drawStroke(stroke);
          }
          return resolve();
        }
  
        const p1 = stroke.points[currentIndex];
        const p2 = stroke.points[currentIndex + 1];
  
        context.beginPath();
        context.lineWidth = stroke.width;
        context.strokeStyle = '#808080';
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.stroke();
  
        currentIndex++;
        requestAnimationFrame(drawStep);
      };
  
      drawStep();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;

    canvas.style.width = isFullSize ? `${window.innerWidth}px` : `${window.innerWidth / 2}px`;
    canvas.style.height = isFullSize ? `${window.innerHeight * 0.95}px` : `${(window.innerHeight * 0.95) / 2}px`;

    const context = canvas.getContext('2d');
    if (context) {
      context.scale(scale, scale);
      context.lineCap = 'round';
      context.lineWidth = brushStyle.size;
      context.strokeStyle = brushStyle.color.hex;
      contextRef.current = context;
    }
  }, []);

  return (
    <div style={{ width: isFullSize ? '100%' : '50%' }} onClick={() => openDrawingToolMenu && setOpenDrawingToolMenu(false)} className='flex flex-col bg-white'>  
      <Header
        tool={tool}
        brushStyle={brushStyle}
        colors={colors}
        handleChangeTool={handleChangeTool}
        setTool={setTool}
        clearCanvas={clearCanvas}
      />
      {openDrawingToolMenu &&
        <DrawingToolMenu
          brushStyle={brushStyle}
          handleChangeBrushStyle={handleChangeBrushStyle}
          playingColors={playingColors}
          setPlayingColors={setPlayingColors}
        />
      }
      <canvas
        ref={canvasRef}
        onTouchStart={!isToolBrush ? undefined : startDrawing}
        onTouchMove={!isToolBrush ? undefined : draw}
        onTouchEnd={!isToolBrush ? undefined : finishDrawing}
        onMouseDown={!isToolBrush ? undefined : startDrawing}
        onMouseMove={!isToolBrush ? undefined : draw}
        onMouseUp={!isToolBrush ? undefined : finishDrawing}
        onMouseLeave={!isToolBrush ? undefined : finishDrawing}
        style={{ touchAction: 'none' }}
        onClick={!isToolBrush ? handleCanvasClick : undefined}
      />
      {isFullSize &&
      <button
        className='absolute right-12 bottom-8 bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-200'
        onClick={() => console.log("finalizou")}
      >
        Finalizar desenho
      </button>}
    </div>
  );
};

export default DrawingCanvas;