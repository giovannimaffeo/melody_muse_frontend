import { Stroke } from '../../interfaces/stroke';
import { calculateStrokeLengthInPixels } from '../calculateStrokeLengthInPixels';
import { colors } from '../colors';
import { initialBrushSize } from '../initialBrushSize';
import { generateCircle } from './utils/generateCircle';
import { interpolatePoints } from './utils/interpolatePoints';

export const generateBoyKickingBall = (width: number, height: number): Stroke[] => {
  const strokes: Stroke[] = [];
  const randomId = () => crypto.randomUUID();

  const getColor = (name: string) => {
    const color = colors.find(color => color.name === name);
    if (!color) {
      throw new Error(`Color ${name} not found in the color palette.`);
    }
    return color;
  };

  // Cabeça do garoto (círculo)
  strokes.push({
    id: randomId(),
    color: getColor('pink'),
    width: initialBrushSize,
    points: interpolatePoints(generateCircle(width * 0.3, height * 0.4, width * 0.05)),
  });

  // Corpo do garoto (linha reta)
  strokes.push({
    id: randomId(),
    color: getColor('purple'),
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.3, y: height * 0.45 },
      { x: width * 0.3, y: height * 0.55 },
    ]),
  });

  // Braços do garoto
  strokes.push({
    id: randomId(),
    color: getColor('blue'),
    width: initialBrushSize / 2,
    points: interpolatePoints([
      { x: width * 0.25, y: height * 0.48 },
      { x: width * 0.35, y: height * 0.48 },
    ]),
  });

  // Perna de apoio
  strokes.push({
    id: randomId(),
    color: getColor('red'),
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.3, y: height * 0.55 },
      { x: width * 0.28, y: height * 0.65 },
    ]),
  });

  // Perna chutando a bola
  strokes.push({
    id: randomId(),
    color: getColor('orange'),
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.3, y: height * 0.55 },
      { x: width * 0.35, y: height * 0.62 },
    ]),
  });

  // Bola de futebol (círculo)
  strokes.push({
    id: randomId(),
    color: getColor('orange'),
    width: initialBrushSize,
    points: interpolatePoints(generateCircle(width * 0.37, height * 0.62, width * 0.03)),
  });

  // Detalhes da bola
  strokes.push({
    id: randomId(),
    color: getColor('yellow'),
    width: initialBrushSize / 2,
    points: interpolatePoints([
      { x: width * 0.36, y: height * 0.61 },
      { x: width * 0.38, y: height * 0.63 },
    ]),
  });

  strokes.push({
    id: randomId(),
    color: getColor('yellow'),
    width: initialBrushSize / 2,
    points: interpolatePoints([
      { x: width * 0.37, y: height * 0.61 },
      { x: width * 0.37, y: height * 0.63 },
    ]),
  });

  // Gol (retângulo)
  strokes.push({
    id: randomId(),
    color: getColor('green'),
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.6, y: height * 0.5 },
      { x: width * 0.8, y: height * 0.5 },
      { x: width * 0.8, y: height * 0.7 },
      { x: width * 0.6, y: height * 0.7 },
      { x: width * 0.6, y: height * 0.5 },
    ]),
  });

  // Grama (linhas onduladas)
  const grassY = height * 0.7;
  strokes.push({
    id: randomId(),
    color: getColor('green'),
    width: initialBrushSize / 2,
    points: interpolatePoints([
      { x: width * 0.1, y: grassY },
      { x: width * 0.2, y: grassY - 5 },
      { x: width * 0.3, y: grassY },
      { x: width * 0.4, y: grassY - 5 },
      { x: width * 0.5, y: grassY },
    ]),
  });

  return strokes.map(stroke => ({
    ...stroke,
    length: calculateStrokeLengthInPixels(stroke.points),
  }));
};
