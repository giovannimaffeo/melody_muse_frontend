import { useRef, useEffect, useState } from 'react';
import { FaPaintBrush } from 'react-icons/fa';
import { FaEraser } from 'react-icons/fa6';
import { VscDebugRestart } from 'react-icons/vsc';
import DrawingToolMenu from '../components/DrawingToolMenu';

const DrawingCanvas = () => {
  const canvasRef: any = useRef(null);
  const contextRef: any = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [openDrawingToolMenu, setOpenDrawingToolMenu] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [brushSize, setBrushSize] = useState(10);
  const [strokes, setStrokes] = useState<any[]>([]); // Lista de traços
  const [selectedStroke, setSelectedStroke] = useState<any | null>(null); // Traço selecionado
  const [showPopup, setShowPopup] = useState(false);

  const colorOptions = [
    { color: "red", hex: "#ef4444", sound: new Audio('/assets/sounds/green.wav') },
    { color: "orange", hex: "#f97316", sound: new Audio('/assets/sounds/green.wav') },
    { color: "yellow", hex: "#eab308", sound: new Audio('/assets/sounds/green.wav') },
    { color: "green", hex: "#22c55e", sound: new Audio('/assets/sounds/green.wav') },
    { color: "blue", hex: "#3b82f6", sound: new Audio('/assets/sounds/green.wav') },
    { color: "pink", hex: "#ec4899", sound: new Audio('/assets/sounds/green.wav') },
    { color: "purple", hex: "#a855f7", sound: new Audio('/assets/sounds/green.wav') },
  ];
  const [color, setColor] = useState(colorOptions[0]);

  const [currentStroke, setCurrentStroke] = useState<{ color: string; width: number; points: { x: number; y: number }[] }>({
    color: color.hex,
    width: brushSize,
    points: [],
  });

  // Função para verificar se o clique está próximo de um traço
  const isPointNearStroke = (x: number, y: number, stroke: any) => {
    const tolerance = 10; // Tolerância para detectar proximidade
    for (let i = 0; i < stroke.points.length - 1; i++) {
      const p1 = stroke.points[i];
      const p2 = stroke.points[i + 1];
      const dist =
        Math.abs(
          (p2.y - p1.y) * x - (p2.x - p1.x) * y + p2.x * p1.y - p2.y * p1.x
        ) / Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2);
      if (dist < tolerance) {
        return true;
      }
    }
    return false;
  };

  // Função para detectar o clique no traço
  const handleCanvasClick = (event: any) => {
    const { offsetX, offsetY } = getOffset(event);

    let selectedIndex: number | null = null;

    // Verificar se o clique está em algum traço
    for (let i = 0; i < strokes.length; i++) {
      if (isPointNearStroke(offsetX, offsetY, strokes[i])) {
        selectedIndex = i;
        break;
      }
    }

    // Atualizar o estado com o traço selecionado
    if (selectedIndex !== null) {
      setSelectedStroke(strokes[selectedIndex]);
      setShowPopup(true);
    }
  };

  // Função para começar o desenho
  const startDrawing = (event: any) => {
    event.preventDefault();
    const touch = event.touches ? event.touches[0] : event;
    const { offsetX, offsetY } = getOffset(touch);

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    // Inicializar o traço atual
    setCurrentStroke({
      color: color.hex,
      width: brushSize,
      points: [{ x: offsetX, y: offsetY }],
    });
  };

  // Função para terminar o desenho
  const finishDrawing = () => {
    if (!isDrawing) return;
    contextRef.current.closePath();
    setIsDrawing(false);

    // Calcular o comprimento do traço
    let length = 0;
    for (let i = 1; i < currentStroke.points.length; i++) {
      const p1 = currentStroke.points[i - 1];
      const p2 = currentStroke.points[i];
      length += Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
    }

    // Adicionar o comprimento e guardar o traço
    const strokeData = {
      color: currentStroke.color,
      width: currentStroke.width,
      length: Math.round(length),
      points: currentStroke.points,
    };
    setStrokes((prevStrokes) => [...prevStrokes, strokeData]);
  };

  // Função de desenho
  const draw = (event: any) => {
    event.preventDefault();
    if (!isDrawing) return;

    const touch = event.touches ? event.touches[0] : event;
    const { offsetX, offsetY } = getOffset(touch);

    contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : currentStroke.color;
    contextRef.current.lineWidth = tool === 'eraser' ? 25 : currentStroke.width;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Adicionar ponto ao traço
    setCurrentStroke((prevStroke) => ({
      ...prevStroke,
      points: [...prevStroke.points, { x: offsetX, y: offsetY }],
    }));
  };

  // Obter a posição do toque/mouse
  const getOffset = (touch: any) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  };

  // Limpar o canvas
  const clearCanvas = () => {
    const context = contextRef.current;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setStrokes([]);
    setSelectedStroke(null); // Limpar seleção de traço
  };

  // Efeito de inicialização
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

  return (
    <div className="flex flex-col w-screen h-screen bg-white">
      <div className='flex bg-purple-700 h-[5%] w-full items-center pl-4'>
        <button onClick={() => (setOpenDrawingToolMenu(!openDrawingToolMenu), setTool('pencil'))}><FaPaintBrush /></button>
        <button onClick={() => setTool('eraser')}><FaEraser /></button>
        <button onClick={clearCanvas}><VscDebugRestart /></button>
      </div>
      {openDrawingToolMenu && (
        <DrawingToolMenu colorOptions={colorOptions} brushSize={brushSize} setBrushSize={setBrushSize} setColor={setColor} />
      )}
      <canvas
        ref={canvasRef}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={finishDrawing}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onClick={handleCanvasClick} // Detectar clique para selecionar traços
        className="h-[95%] w-full"
      />
      {showPopup && selectedStroke && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Detalhes do Traço Selecionado</h2>
            <p><strong>Cor:</strong> {selectedStroke.color}</p>
            <p><strong>Espessura:</strong> {selectedStroke.width}</p>
            <p><strong>Comprimento:</strong> {selectedStroke.length}px</p>
            <button onClick={() => setShowPopup(false)} className="mt-4 bg-purple-700 text-white px-4 py-2 rounded">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingCanvas;
