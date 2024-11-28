import { Stroke } from "../../interfaces/stroke";
import { calculateStrokeLengthInPixels } from "../calculateStrokeLengthInPixels";
import { colors } from "../colors";
import { initialBrushSize } from "../initialBrushSize";
import { interpolatePoints } from "./utils/interpolatePoints";

export const generateCross = (x: number, y: number, size: number, color: string): Stroke[] => {
    const strokes: Stroke[] = [];
    const randomId = () => crypto.randomUUID();

    strokes.push({
        id: randomId(),
        color: colors.find(c => c.name === color)!,
        width: initialBrushSize,
        points: interpolatePoints([
        { x: x - size * 0.1, y: y },
        { x: x + size * 0.1, y: y },
        ]),
    });

    strokes.push({
        id: randomId(),
        color: colors.find(c => c.name === color)!,
        width: initialBrushSize,
        points: interpolatePoints([
        { x: x, y: y - size * 0.15 },
        { x: x, y: y + size * 0.15 },
        ]),
    });

    return strokes;
};
  

export const generateChurch = (width: number, height: number): Stroke[] => {
    const strokes: Stroke[] = [];
    const randomId = () => crypto.randomUUID();
  
    const getColor = (name: string) => {
      const color = colors.find(color => color.name === name);
      if (!color) {
        throw new Error(`Color ${name} not found in the color palette.`);
      }
      return color;
    };
  
    // Corpo da igreja
    strokes.push({
      id: randomId(),
      color: getColor("blue"),
      width: initialBrushSize,
      points: interpolatePoints([
        { x: width * 0.4, y: height * 0.5 },
        { x: width * 0.6, y: height * 0.5 },
        { x: width * 0.6, y: height * 0.7 },
        { x: width * 0.4, y: height * 0.7 },
        { x: width * 0.4, y: height * 0.5 },
      ]),
    });
  
    // Telhado da igreja
    strokes.push({
      id: randomId(),
      color: getColor("red"),
      width: initialBrushSize,
      points: interpolatePoints([
        { x: width * 0.4, y: height * 0.5 },
        { x: width * 0.5, y: height * 0.35 },
        { x: width * 0.6, y: height * 0.5 },
        { x: width * 0.4, y: height * 0.5 },
      ]),
    });
  
    // Cruz no topo
    strokes.push(...generateCross(width * 0.5, height * 0.3, width * 0.05, "yellow"));
  
    return strokes.map(stroke => ({
      ...stroke,
      length: calculateStrokeLengthInPixels(stroke.points),
    }));
  };
  