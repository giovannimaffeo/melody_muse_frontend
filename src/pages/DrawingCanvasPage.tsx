import { useRef, useEffect, useState, MouseEvent } from 'react';
import { FaPaintBrush } from 'react-icons/fa';
import { FaEraser } from 'react-icons/fa6';
import { VscDebugRestart } from 'react-icons/vsc';
import { GiClick } from "react-icons/gi";

import DrawingToolMenu from '../components/DrawingToolMenu';
import { colors } from '../constants/colors';
import { BrushStyle } from '../interfaces/brushStyle';
import { eraserColor, eraserSize } from '../constants/eraser';
import { initialBrushSize } from '../constants/initialBrushSize';
import { Stroke } from '../interfaces/stroke';
import { rate } from '../constants/rate';
import { Color } from '../interfaces/color';

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [openDrawingToolMenu, setOpenDrawingToolMenu] = useState<boolean>(false);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'click'>('brush');
  const [strokes, setStrokes] = useState<Stroke[]>([]); 
  const [currentStroke, setCurrentStroke] = useState<Stroke | undefined>();
  const [brushStyle, setBrushStyle] = useState<BrushStyle>({
    color: colors[0],
    size: initialBrushSize
  });
  const [playingColors, setPlayingColors] = useState<Color[]>([]); 

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
    const touch = event.touches ? event.touches[0] : event;
    const { offsetX, offsetY } = getOffset(touch);
    
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    setCurrentStroke({
      color: brushStyle.color,
      width: brushStyle.size,
      points: [{ x: offsetX, y: offsetY }]
    });
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
    if (!isDrawing) return;

    const touch = event.touches ? event.touches[0] : event;
    const { offsetX, offsetY } = getOffset(touch);

    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();

      currentStroke && setCurrentStroke({
        ...currentStroke,
        points: [...currentStroke.points, { x: offsetX, y: offsetY }]
      });
    };
  };

  const calculateStrokeLengthInPixels = () => {
    if (currentStroke) {
      const { points } = currentStroke;
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
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);

    const length = calculateStrokeLengthInPixels();
    if (length && currentStroke) {
      setStrokes([...strokes, { ...currentStroke, length }]);
      setCurrentStroke(undefined);
    };
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
  
    console.log(selectedStroke);
    selectedStroke && animateStrokeWithSound(selectedStroke);
  };  

  const animateStrokeWithSound = (stroke: Stroke, shouldClear: boolean = true) => {
    const context = contextRef.current;
    if (!context) return;
  
    const length = stroke.length ?? 0; // Comprimento total do traço
    const duration = length / rate; // Duração em segundos
    const audio = stroke.color.sound;
  
    let currentIndex = 0;
  
    // Inicializa limites para limpar o traço depois
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;
  
    // Configurar o volume do áudio com base na largura do traço
    if (audio) {
      const minWidth = 1;
      const maxWidth = 50;
  
      // Normaliza a largura do traço para o intervalo de volume (0 a 1)
      const volume = Math.min(Math.max((stroke.width - minWidth) / (maxWidth - minWidth), 0), 1);
      audio.volume = volume;
  
      // Configurar o áudio
      audio.currentTime = 0; // Começa a tocar do início
      audio.play(); // Toca o áudio
  
      // Parar o áudio após a duração calculada
      const stopTime = Math.min(audio.duration, duration); // Não exceder a duração do áudio
      setTimeout(() => {
        audio.pause();
      }, stopTime * 1000); // Convertendo para milissegundos
    }
  
    const drawOriginalStroke = () => {
      // Redesenha o traço original após limpar o cinza
      context.beginPath();
      context.lineWidth = stroke.width;
      context.strokeStyle = stroke.color.hex; // Cor original
      stroke.points.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      });
      context.stroke();
    };
  
    const drawStep = () => {
      if (currentIndex >= stroke.points.length - 1) {
        // Finaliza a animação
        if (shouldClear) {
          setTimeout(() => {
            context.clearRect(
              xMin - stroke.width,
              yMin - stroke.width,
              xMax - xMin + stroke.width * 2,
              yMax - yMin + stroke.width * 2
            );
            drawOriginalStroke(); // Redesenha o traço original
          }, 100); // Pequeno atraso para garantir a finalização
        }
        return;
      }
  
      const p1 = stroke.points[currentIndex];
      const p2 = stroke.points[currentIndex + 1];
  
      // Atualiza os limites do traço
      xMin = Math.min(xMin, p1.x, p2.x);
      xMax = Math.max(xMax, p1.x, p2.x);
      yMin = Math.min(yMin, p1.y, p2.y);
      yMax = Math.max(yMax, p1.y, p2.y);
  
      // Configura o contexto para o traço
      context.beginPath();
      context.lineWidth = stroke.width;
      context.strokeStyle = '#808080'; // Cinza escuro
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.stroke();
  
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);
      const time = (segmentLength / rate) * 1000; // Tempo para este segmento em milissegundos
  
      currentIndex++;
  
      // Chama o próximo segmento
      setTimeout(() => requestAnimationFrame(drawStep), time);
    };
  
    // Inicia a animação
    drawStep();
  };
      
  const playAllStrokes = () => {
    const context = contextRef.current;
    if (!context) return;
  
    let currentIndex = 0;
  
    const playNextStroke = () => {
      if (currentIndex >= strokes.length) {
        // Apaga todos os traços cinza e redesenha os originais
        setTimeout(() => {
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  
          // Redesenha todos os traços originais
          strokes.forEach((stroke) => {
            context.beginPath();
            context.lineWidth = stroke.width;
            context.strokeStyle = stroke.color.hex;
            stroke.points.forEach((point, index) => {
              if (index === 0) {
                context.moveTo(point.x, point.y);
              } else {
                context.lineTo(point.x, point.y);
              }
            });
            context.stroke();
          });
        }, 100); // Pequeno atraso para garantir a finalização da última animação
        return;
      }
  
      // Anima o próximo traço sem apagar ou redesenhar
      animateStrokeWithSound(strokes[currentIndex], false);
  
      // Calcula o tempo para chamar o próximo traço
      let strokeDuration = 0;
      if (strokes && currentIndex < strokes.length) {
        // Verifica se strokes e o índice são válidos
        const stroke = strokes[currentIndex];
        strokeDuration = (stroke.length ?? 0) / rate; // Calcula a duração do traço
      };

      currentIndex++;
  
      // Chama o próximo traço após a duração atual
      setTimeout(playNextStroke, strokeDuration * 1000);
    };
  
    // Inicia a animação do primeiro traço
    playNextStroke();
  };

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
      <div className='flex bg-purple-700 h-[5%] w-full pl-[1.5%] items-center justify-center'>
        <button 
          onClick={() => handleChangeTool('brush')} 
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
          onClick={() => handleChangeTool('eraser')} 
          style={{
            backgroundColor: tool === 'eraser' ? '#F8FAFC' : 'transparent'
          }} 
          className='p-0 h-7 w-7 flex justify-center items-center rounded-full ml-[0.3%]'
        >
          <FaEraser 
            style={{ fill: tool === 'eraser' ? colors.find(option => option.name === 'purple')?.hex : 'white' }}
            className='size-[75%]' 
          />
        </button>
        <button 
          onClick={() => setTool('click')} 
          style={{
            backgroundColor: tool === 'click' ? '#F8FAFC' : 'transparent'
          }} 
          className='p-0 h-7 w-7 flex justify-center items-center rounded-full ml-[0.5%]'
        >
          <GiClick  
            style={{ fill: tool === 'click' ? colors.find(option => option.name === 'purple')?.hex : 'white' }}
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
          handleChangeBrushStyle={handleChangeBrushStyle}
          playingColors={playingColors}
          setPlayingColors={setPlayingColors}
        />
      }
      <canvas
        ref={canvasRef}
        onTouchStart={tool === 'click' ? undefined : startDrawing}
        onTouchMove={tool === 'click' ? undefined : draw}
        onTouchEnd={tool === 'click' ? undefined : finishDrawing}
        onMouseDown={tool === 'click' ? undefined : startDrawing}
        onMouseMove={tool === 'click' ? undefined : draw}
        onMouseUp={tool === 'click' ? undefined : finishDrawing}
        onMouseLeave={tool === 'click' ? undefined : finishDrawing}
        className='h-[95%] w-full'
        style={{ touchAction: 'none' }}
        onClick={tool === 'click' ? handleCanvasClick : undefined}
      />
      <button
        className='absolute right-12 bottom-8 bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-200'
        onClick={() => {console.log(strokes); playAllStrokes()}}
      >
        Gerar Música
      </button>
    </div>
  );
};

export default DrawingCanvas;