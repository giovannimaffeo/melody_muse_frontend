import { Stroke } from '../../interfaces/stroke';
import { calculateStrokeLengthInPixels } from '../calculateStrokeLengthInPixels';
import { colors } from '../colors';
import { initialBrushSize } from '../initialBrushSize';
import { generateCircle } from './utils/generateCircle';
import { interpolatePoints } from './utils/interpolatePoints';

export const generateHouseWithGarden = (width: number, height: number): Stroke[] => {
  const strokes: Stroke[] = [];
  const randomId = () => crypto.randomUUID();

  // 1. Base da casa (Retângulo)
  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'red')!,
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.4, y: height * 0.5 },
      { x: width * 0.6, y: height * 0.5 },
      { x: width * 0.6, y: height * 0.7 },
      { x: width * 0.4, y: height * 0.7 },
      { x: width * 0.4, y: height * 0.5 },
    ]),
  });

  // 2. Telhado da casa (Triângulo)
  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'orange')!,
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.4, y: height * 0.5 },
      { x: width * 0.5, y: height * 0.35 },
      { x: width * 0.6, y: height * 0.5 },
      { x: width * 0.4, y: height * 0.5 },
    ]),
  });

  // 3. Porta da casa
  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'yellow')!,
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.48, y: height * 0.7 },
      { x: width * 0.52, y: height * 0.7 },
      { x: width * 0.52, y: height * 0.6 },
      { x: width * 0.48, y: height * 0.6 },
      { x: width * 0.48, y: height * 0.7 },
    ]),
  });

  // 4. Janela da casa (Pequeno quadrado)
  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'blue')!,
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.43, y: height * 0.55 },
      { x: width * 0.47, y: height * 0.55 },
      { x: width * 0.47, y: height * 0.6 },
      { x: width * 0.43, y: height * 0.6 },
      { x: width * 0.43, y: height * 0.55 },
    ]),
  });

  // 5. Árvore ao lado da casa (Tronco)
  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'orange')!,
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.3, y: height * 0.6 },
      { x: width * 0.32, y: height * 0.6 },
      { x: width * 0.32, y: height * 0.7 },
      { x: width * 0.3, y: height * 0.7 },
      { x: width * 0.3, y: height * 0.6 },
    ]),
  });

  // 6. Folhas da árvore (Círculo aproximado)
  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'green')!,
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.29, y: height * 0.55 },
      { x: width * 0.33, y: height * 0.55 },
      { x: width * 0.34, y: height * 0.58 },
      { x: width * 0.33, y: height * 0.61 },
      { x: width * 0.29, y: height * 0.61 },
      { x: width * 0.28, y: height * 0.58 },
      { x: width * 0.29, y: height * 0.55 },
    ]),
  });

  // 7. Sol (Círculo no canto superior direito)
  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'yellow')!,
    width: initialBrushSize,
    points: interpolatePoints(generateCircle(width * 0.85, height * 0.15, width * 0.05)),
  });

  return strokes.map((stroke) => ({
    ...stroke,
    length: calculateStrokeLengthInPixels(stroke.points),
  }));
};
