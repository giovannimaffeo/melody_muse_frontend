import { useRef, useEffect, useState, MouseEvent } from 'react';

import DrawingToolMenu from '../components/DrawingToolMenu';
import { colors } from '../constants/colors';
import { BrushStyle } from '../interfaces/brushStyle';
import { eraserColor, eraserSize } from '../constants/eraser';
import { initialBrushSize } from '../constants/initialBrushSize';
import { Stroke } from '../interfaces/stroke';
import { Color } from '../interfaces/color';
import Header from '../components/Header';
import MusicGenerationPopup from '../components/MusicGenerationPopup';

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [openDrawingToolMenu, setOpenDrawingToolMenu] = useState<boolean>(false);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'click'>('brush');
  const [strokes, setStrokes] = useState<Stroke[]>([]); 

  const [currentStroke, setCurrentStroke] = useState<Stroke | undefined>();
  const [activeStrokes, setActiveStrokes] = useState<Stroke[]>([]);

  const [brushStyle, setBrushStyle] = useState<BrushStyle>({
    color: colors[0],
    size: initialBrushSize
  });
  const [playingColors, setPlayingColors] = useState<Color[]>([]); 
  const [showPopup, setShowPopup] = useState(false);
  const [reorganizeStrokesMode, setReorganizeStrokesMode] = useState(false);
  const [reorganizedStrokes, setReorganizedStrokes] = useState<Stroke[]>([]);

  const handleChangeTool = (tool: 'brush' | 'eraser') => {
    setTool(tool);
    const isToolBrush = tool === 'brush';

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

  const startDrawing = (event: any) => {
    event.preventDefault();
  
    const touches = event.touches ? Array.from(event.touches) : []; // Captura todos os toques ativos
    const newActiveStrokes = touches.map((touch) => {
      const { offsetX, offsetY } = getOffset(touch);
      const touchId = touch.identifier.toString(); // Identificador único do toque

      // Inicia um novo traço para o toque atual
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(offsetX, offsetY);

      return {
        id: touchId,
        color: brushStyle.color,
        width: brushStyle.size,
        points: [{ x: offsetX, y: offsetY }],
      };
    });

    console.log(newActiveStrokes)
    
    setActiveStrokes(newActiveStrokes);
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

  const draw = (event: any) => {
    event.preventDefault();
    if (tool !== 'brush') return; // Certifica-se de que estamos no modo de brush
  
    const touches = event.touches ? Array.from(event.touches) : []; // Captura todos os toques ativos
    setActiveStrokes((prevStrokes) => {
      const updatedStrokes = prevStrokes.map((stroke) => {
        // Procura o toque correspondente ao traço
        const touch = touches.find((t) => t.identifier.toString() === stroke.id);
        if (!touch) return stroke; // Se não encontrar o toque correspondente, mantém o traço atual
  
        const { offsetX, offsetY } = getOffset(touch);
  
        const lastPoint = stroke.points[stroke.points.length - 1];
        if (contextRef.current && lastPoint) {
          contextRef.current.beginPath();
          contextRef.current.moveTo(lastPoint.x, lastPoint.y);
          contextRef.current.lineTo(offsetX, offsetY);
          contextRef.current.lineWidth = stroke.width;
          contextRef.current.strokeStyle = stroke.color.hex;
          contextRef.current.stroke();
  
          // Adiciona interpolação entre pontos para suavidade
          const dx = offsetX - lastPoint.x;
          const dy = offsetY - lastPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance > 2) {
            const steps = Math.ceil(distance / 2);
            for (let i = 1; i <= steps; i++) {
              const x = lastPoint.x + (dx * i) / steps;
              const y = lastPoint.y + (dy * i) / steps;
              stroke.points.push({ x, y });
            }
          }
  
          stroke.points.push({ x: offsetX, y: offsetY });
        }
  
        return {
          ...stroke,
          points: [...stroke.points],
        };
      });
  
      return updatedStrokes;
    });
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

  const finishDrawing = (event: any) => {
    event.preventDefault();
  
    const touches = event.changedTouches ? Array.from(event.changedTouches) : []; // Toques finalizados  
    
    let completedStrokes: Stroke[] = [];
    touches.forEach((touch) => {
      activeStrokes.forEach((activeStroke) => {
        const touchId = touch.identifier.toString(); // Identificador do toque
  
        if (touchId === activeStroke.id) {
          const length = calculateStrokeLengthInPixels(activeStroke.points);
  
          // Adiciona o traço finalizado à lista
          completedStrokes = [...completedStrokes, {...activeStroke, id: crypto.randomUUID(), length}]  
        };
      });
    });

    setStrokes([...strokes, ...completedStrokes]) 
  };  

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setStrokes([]);
      setCurrentStroke(undefined);
    };
  };

  const handleCanvasClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = getOffset(event);
  
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

    if (reorganizeStrokesMode) {
      console.log('strokes', strokes)
      console.log('selectedStroke', selectedStroke);
      selectedStroke && addToReorganizedStrokes(selectedStroke);
    } else if (tool === 'eraser') {
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
  
  const playAllStrokes = async (playStrokes: Stroke[] = strokes) => {
    console.log(strokes);

    for (const stroke of playStrokes) {
      await animateStrokeWithSound(stroke, false);
    };
  
    playStrokes.forEach((stroke) => {
      eraseStroke(stroke);
      drawStroke(stroke);
    });
  };

  const addToReorganizedStrokes = async (selectedStroke: Stroke) => {
    const strokeInReorganized = reorganizedStrokes.some((stroke) => stroke.id === selectedStroke.id);

    if (!strokeInReorganized) {
      if (reorganizedStrokes.length + 1 !== strokes.length) {
        setReorganizedStrokes([...reorganizedStrokes, selectedStroke]);
      } else {
        setReorganizeStrokesMode(false);
        playAllStrokes([...reorganizedStrokes, selectedStroke])
        setReorganizedStrokes([]);
      };
    };
  };

  const isDrawMode = tool === 'brush' && !reorganizeStrokesMode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * 0.95 * scale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight * 0.95}px`;

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
    <div onClick={() => openDrawingToolMenu && setOpenDrawingToolMenu(false)} className='flex flex-col w-screen h-screen bg-white'>  
      {showPopup && (
        <MusicGenerationPopup
          onClose={() => setShowPopup(false)}
          onPlayInOrder={playAllStrokes}
          onReorganizeAndPlay={() => setReorganizeStrokesMode(true)}
        />
      )}
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
        onTouchStart={!isDrawMode ? undefined : startDrawing}
        onTouchMove={!isDrawMode ? undefined : draw}
        onTouchEnd={!isDrawMode ? undefined : finishDrawing}
        onMouseDown={!isDrawMode ? undefined : startDrawing}
        onMouseMove={!isDrawMode ? undefined : draw}
        onMouseUp={!isDrawMode ? undefined : finishDrawing}
        onMouseLeave={!isDrawMode ? undefined : finishDrawing}
        className='h-[95%] w-full'
        style={{ touchAction: 'none' }}
        onClick={!isDrawMode ? handleCanvasClick : undefined}
      />
      {!reorganizeStrokesMode && 
      <button
        className='absolute right-12 bottom-8 bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-200'
        onClick={() => {console.log(strokes); setShowPopup(true)}}
      >
        Gerar Música
      </button>}
    </div>
  );
};

export default DrawingCanvas;