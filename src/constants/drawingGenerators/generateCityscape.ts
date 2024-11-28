import { Stroke } from "../../interfaces/stroke";
import { calculateStrokeLengthInPixels } from "../calculateStrokeLengthInPixels";
import { colors } from "../colors";
import { initialBrushSize } from "../initialBrushSize";
import { interpolatePoints } from "./utils/interpolatePoints";

export const generateCityscape = (width: number, height: number): Stroke[] => {
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
    strokes.push({
      id: randomId(),
      color: getColor('blue'),
      width: initialBrushSize,
      points: interpolatePoints([
        { x: 0, y: height * 0.8 },
        { x: width, y: height * 0.8 },
      ]),
    });
    strokes.push({
      id: randomId(),
      color: getColor('blue'),
      width: initialBrushSize,
      points: interpolatePoints([
        { x: 0, y: height * 0.85 },
        { x: width, y: height * 0.85 },
      ]),
    });
  
    // Faixas da rua (linhas tracejadas)
    for (let i = 0; i < width; i += width * 0.1) {
      strokes.push({
        id: randomId(),
        color: getColor('yellow'),
        width: initialBrushSize / 2,
        points: interpolatePoints([
          { x: i, y: height * 0.825 },
          { x: i + width * 0.05, y: height * 0.825 },
        ]),
      });
    }
  
    // Prédios
    const buildingWidths = [0.15, 0.2, 0.1, 0.2, 0.15];
    let currentX = 0;
  
    buildingWidths.forEach((buildingWidth, index) => {
      const buildingHeight = height * (0.5 + Math.random() * 0.2);
      const windowsColor = index % 2 === 0 ? getColor('yellow') : getColor('blue');
      const buildingColor = index % 2 === 0 ? getColor('purple') : getColor('pink');
  
      // Corpo do prédio
      strokes.push({
        id: randomId(),
        color: buildingColor,
        width: initialBrushSize,
        points: interpolatePoints([
          { x: currentX, y: height * 0.8 },
          { x: currentX, y: height * 0.8 - buildingHeight },
          { x: currentX + width * buildingWidth, y: height * 0.8 - buildingHeight },
          { x: currentX + width * buildingWidth, y: height * 0.8 },
          { x: currentX, y: height * 0.8 },
        ]),
      });
  
      // Janelas
      const numRows = 3;
      const numCols = Math.floor(buildingWidth * 10);
      const windowWidth = (width * buildingWidth) / (numCols + 1);
      const windowHeight = buildingHeight / (numRows + 1);
  
      for (let row = 1; row <= numRows; row++) {
        for (let col = 1; col <= numCols; col++) {
          strokes.push({
            id: randomId(),
            color: windowsColor,
            width: initialBrushSize / 2,
            points: interpolatePoints([
              { x: currentX + col * windowWidth - windowWidth / 2, y: height * 0.8 - row * windowHeight },
              { x: currentX + col * windowWidth + windowWidth / 2, y: height * 0.8 - row * windowHeight },
              { x: currentX + col * windowWidth + windowWidth / 2, y: height * 0.8 - row * windowHeight - windowHeight / 2 },
              { x: currentX + col * windowWidth - windowWidth / 2, y: height * 0.8 - row * windowHeight - windowHeight / 2 },
              { x: currentX + col * windowWidth - windowWidth / 2, y: height * 0.8 - row * windowHeight },
            ]),
          });
        }
      }
  
      currentX += width * buildingWidth;
    });
  
    return strokes.map(stroke => ({
      ...stroke,
      length: calculateStrokeLengthInPixels(stroke.points),
    }));
  };