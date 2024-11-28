import { Stroke } from "../../interfaces/stroke";
import { calculateStrokeLengthInPixels } from "../calculateStrokeLengthInPixels";
import { colors } from "../colors";
import { initialBrushSize } from "../initialBrushSize";
import { generateCircle } from "./utils/generateCircle";
import { interpolatePoints } from "./utils/interpolatePoints";

export const generateCarOnStreet = (width: number, height: number): Stroke[] => {
  const strokes: Stroke[] = [];
  const randomId = () => crypto.randomUUID();

  const getColor = (name: string) => {
    const color = colors.find(color => color.name === name);
    if (!color) {
      throw new Error(`Color ${name} not found in the color palette.`);
    }
    return color;
  };

  // Rua (linhas paralelas)
  const streetYOffset = height * 0.7; // Ajuste para subir a rua
  strokes.push({
    id: randomId(),
    color: getColor('blue'),
    width: initialBrushSize,
    points: interpolatePoints([
      { x: 0, y: streetYOffset },
      { x: width, y: streetYOffset },
    ]),
  });
  strokes.push({
    id: randomId(),
    color: getColor('blue'),
    width: initialBrushSize,
    points: interpolatePoints([
      { x: 0, y: streetYOffset + 20 },
      { x: width, y: streetYOffset + 20 },
    ]),
  });

  // Faixas da rua (linhas tracejadas)
  for (let i = 0; i < width; i += width * 0.1) {
    strokes.push({
      id: randomId(),
      color: getColor('yellow'),
      width: initialBrushSize / 2,
      points: interpolatePoints([
        { x: i, y: streetYOffset + 10 },
        { x: i + width * 0.05, y: streetYOffset + 10 },
      ]),
    });
  }

  // Corpo do carro
  const carYOffset = streetYOffset - 40; // Subir o carro acima da rua
  strokes.push({
    id: randomId(),
    color: getColor('red'),
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.4, y: carYOffset },
      { x: width * 0.6, y: carYOffset },
      { x: width * 0.65, y: carYOffset + 30 },
      { x: width * 0.35, y: carYOffset + 30 },
      { x: width * 0.4, y: carYOffset },
    ]),
  });

  // Janela do carro
  strokes.push({
    id: randomId(),
    color: getColor('blue'),
    width: initialBrushSize / 2,
    points: interpolatePoints([
      { x: width * 0.45, y: carYOffset },
      { x: width * 0.55, y: carYOffset },
      { x: width * 0.55, y: carYOffset + 15 },
      { x: width * 0.45, y: carYOffset + 15 },
      { x: width * 0.45, y: carYOffset },
    ]),
  });

  // Rodas do carro
  const wheelRadius = width * 0.03;
  strokes.push({
    id: randomId(),
    color: getColor('green'),
    width: initialBrushSize,
    points: interpolatePoints(generateCircle(width * 0.45, carYOffset + 30, wheelRadius)),
  });
  strokes.push({
    id: randomId(),
    color: getColor('green'),
    width: initialBrushSize,
    points: interpolatePoints(generateCircle(width * 0.55, carYOffset + 30, wheelRadius)),
  });

  return strokes.map(stroke => ({
    ...stroke,
    length: calculateStrokeLengthInPixels(stroke.points),
  }));
};
