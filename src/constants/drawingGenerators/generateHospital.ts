import { Stroke } from "../../interfaces/stroke";
import { calculateStrokeLengthInPixels } from "../calculateStrokeLengthInPixels";
import { colors } from "../colors";
import { initialBrushSize } from "../initialBrushSize";
import { interpolatePoints } from "./utils/interpolatePoints";

export const generateHospital = (width: number, height: number): Stroke[] => {
  const strokes: Stroke[] = [];
  const randomId = () => crypto.randomUUID();

  const getColor = (name: string) => {
    const color = colors.find(color => color.name === name);
    if (!color) {
      throw new Error(`Color ${name} not found in the color palette.`);
    }
    return color;
  };

  // Estrutura principal
  strokes.push({
    id: randomId(),
    color: getColor('blue'),
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.3, y: height * 0.3 },
      { x: width * 0.7, y: height * 0.3 },
      { x: width * 0.7, y: height * 0.7 },
      { x: width * 0.3, y: height * 0.7 },
      { x: width * 0.3, y: height * 0.3 },
    ]),
  });

  // Telhado
  strokes.push({
    id: randomId(),
    color: getColor('red'),
    width: initialBrushSize,
    points: interpolatePoints([
      { x: width * 0.3, y: height * 0.3 },
      { x: width * 0.7, y: height * 0.3 },
      { x: width * 0.5, y: height * 0.2 },
      { x: width * 0.3, y: height * 0.3 },
    ]),
  });

  // Portas
  strokes.push({
    id: randomId(),
    color: getColor('yellow'),
    width: initialBrushSize / 2,
    points: interpolatePoints([
      { x: width * 0.4, y: height * 0.6 },
      { x: width * 0.6, y: height * 0.6 },
      { x: width * 0.6, y: height * 0.7 },
      { x: width * 0.4, y: height * 0.7 },
      { x: width * 0.4, y: height * 0.6 },
    ]),
  });

  // Janelas (quadrados menores)
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      strokes.push({
        id: randomId(),
        color: getColor('pink'),
        width: initialBrushSize / 2,
        points: interpolatePoints([
          {
            x: width * 0.35 + col * 0.1 * width,
            y: height * 0.35 + row * 0.1 * height,
          },
          {
            x: width * 0.4 + col * 0.1 * width,
            y: height * 0.35 + row * 0.1 * height,
          },
        ]),
      });
    }
  }

  return strokes.map(stroke => ({
    ...stroke,
    length: calculateStrokeLengthInPixels(stroke.points),
  }));
};
