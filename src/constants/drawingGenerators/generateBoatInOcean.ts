import { Stroke } from '../../interfaces/stroke';
import { calculateStrokeLengthInPixels } from '../calculateStrokeLengthInPixels';
import { colors } from '../colors';
import { initialBrushSize } from '../initialBrushSize';
import { generateCircle } from './utils/generateCircle';
import { interpolatePoints } from './utils/interpolatePoints';

export const generateBoatInOcean = (width: number, height: number) => {
  const strokes: Stroke[] = [];
  const randomId = () => crypto.randomUUID();

  // Sol (Círculo no fundo)
  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'yellow')!,
    width: initialBrushSize * 2,
    points: interpolatePoints(generateCircle(width * 0.8, height * 0.2, width * 0.1)),
  });

  // Ondas do oceano (linhas onduladas)
  const waveColors = colors.find(color => color.name === 'blue')!;
  const waveYPositions = [height * 0.6, height * 0.65, height * 0.7];
  waveYPositions.forEach(y => {
    strokes.push({
      id: randomId(),
      color: waveColors,
      width: initialBrushSize / 2,
      points: interpolatePoints([
        { x: width * 0.1, y },
        { x: width * 0.2, y: y - 10 },
        { x: width * 0.3, y: y + 10 },
        { x: width * 0.4, y: y },
        { x: width * 0.5, y: y - 10 },
        { x: width * 0.6, y: y + 10 },
        { x: width * 0.7, y: y },
        { x: width * 0.8, y: y - 10 },
        { x: width * 0.9, y: y + 10 },
      ]),
    });
  });

  // Corpo do barco
  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'red')!,
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.4, y: height * 0.55 },
      { x: width * 0.6, y: height * 0.55 },
      { x: width * 0.65, y: height * 0.6 },
      { x: width * 0.35, y: height * 0.6 },
      { x: width * 0.4, y: height * 0.55 },
    ]),
  });

  // Velas do barco (triângulos)
  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'yellow')!,
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.5, y: height * 0.35 },
      { x: width * 0.55, y: height * 0.55 },
      { x: width * 0.45, y: height * 0.55 },
      { x: width * 0.5, y: height * 0.35 },
    ]),
  });

  strokes.push({
    id: randomId(),
    color: colors.find(color => color.name === 'yellow')!,
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.5, y: height * 0.35 },
      { x: width * 0.6, y: height * 0.55 },
      { x: width * 0.5, y: height * 0.55 },
      { x: width * 0.5, y: height * 0.35 },
    ]),
  });

  // Gaivotas (arcos)
  const birdPositions = [
    { x: width * 0.2, y: height * 0.3 },
    { x: width * 0.4, y: height * 0.25 },
    { x: width * 0.6, y: height * 0.3 },
    { x: width * 0.7, y: height * 0.35 },
  ];
  birdPositions.forEach(({ x, y }) => {
    strokes.push({
      id: randomId(),
      color: colors.find(color => color.name === 'orange')!,
      width: initialBrushSize / 2,
      points: interpolatePoints([
        { x: x - 10, y },
        { x, y: y - 5 },
        { x: x + 10, y },
      ]),
    });
  });

  return strokes.map(stroke => ({
    ...stroke,
    length: calculateStrokeLengthInPixels(stroke.points),
  }));
};
