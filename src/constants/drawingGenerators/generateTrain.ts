import { Stroke } from "../../interfaces/stroke";
import { calculateStrokeLengthInPixels } from "../calculateStrokeLengthInPixels";
import { colors } from "../colors";
import { initialBrushSize } from "../initialBrushSize";
import { generateCircle } from "./utils/generateCircle";
import { interpolatePoints } from "./utils/interpolatePoints";

export const generateTrain = (width: number, height: number): Stroke[] => {
const strokes: Stroke[] = [];
const randomId = () => crypto.randomUUID();

const getColor = (name: string) => {
    const color = colors.find(color => color.name === name);
    if (!color) {
    throw new Error(`Color ${name} not found in the color palette.`);
    }
    return color;
};

// Trilhos
strokes.push({
    id: randomId(),
    color: getColor("blue"),
    width: initialBrushSize,
    points: interpolatePoints([
    { x: 0, y: height * 0.6 },
    { x: width, y: height * 0.6 },
    ]),
});

strokes.push({
    id: randomId(),
    color: getColor("blue"),
    width: initialBrushSize,
    points: interpolatePoints([
        { x: 0, y: height * 0.65 },
        { x: width, y: height * 0.65 },
        ]),
    });

    // Faixas nos trilhos
    for (let i = 0; i < width; i += width * 0.1) {
        strokes.push({
        id: randomId(),
        color: getColor("yellow"),
        width: initialBrushSize / 2,
        points: interpolatePoints([
            { x: i, y: height * 0.625 },
            { x: i + width * 0.05, y: height * 0.625 },
        ]),
        });
    }

    // Vagões do trem (retângulos)
    for (let i = 0; i < 3; i++) {
        const wagonStartX = width * (0.2 + i * 0.2);
        const wagonEndX = wagonStartX + width * 0.15;

        strokes.push({
        id: randomId(),
        color: getColor("red"),
        width: initialBrushSize,
        points: interpolatePoints([
            { x: wagonStartX, y: height * 0.4 },
            { x: wagonEndX, y: height * 0.4 },
            { x: wagonEndX, y: height * 0.55 },
            { x: wagonStartX, y: height * 0.55 },
            { x: wagonStartX, y: height * 0.4 },
        ]),
        });

        // Rodas do vagão
        const wheelRadius = width * 0.03;
        strokes.push({
        id: randomId(),
        color: getColor("green"),
        width: initialBrushSize,
        points: interpolatePoints(generateCircle(wagonStartX + width * 0.05, height * 0.57, wheelRadius)),
        });
        strokes.push({
        id: randomId(),
        color: getColor("green"),
        width: initialBrushSize,
        points: interpolatePoints(generateCircle(wagonEndX - width * 0.05, height * 0.57, wheelRadius)),
        });
    }

    // Locomotiva (parte da frente)
    strokes.push({
        id: randomId(),
        color: getColor("yellow"),
        width: initialBrushSize,
        points: interpolatePoints([
        { x: width * 0.1, y: height * 0.35 },
        { x: width * 0.25, y: height * 0.35 },
        { x: width * 0.25, y: height * 0.55 },
        { x: width * 0.1, y: height * 0.55 },
        { x: width * 0.1, y: height * 0.35 },
        ]),
    });

    // Chaminé
    strokes.push({
        id: randomId(),
        color: getColor("pink"),
        width: initialBrushSize,
        points: interpolatePoints([
        { x: width * 0.15, y: height * 0.3 },
        { x: width * 0.18, y: height * 0.3 },
        { x: width * 0.18, y: height * 0.35 },
        { x: width * 0.15, y: height * 0.35 },
        { x: width * 0.15, y: height * 0.3 },
        ]),
    });

    // Fumaça (círculos sobre a chaminé)
    strokes.push({
        id: randomId(),
        color: getColor("orange"),
        width: initialBrushSize / 2,
        points: interpolatePoints(generateCircle(width * 0.165, height * 0.25, width * 0.03)),
    });

    strokes.push({
        id: randomId(),
        color: getColor("orange"),
        width: initialBrushSize / 2,
        points: interpolatePoints(generateCircle(width * 0.18, height * 0.2, width * 0.025)),
    });

    strokes.push({
        id: randomId(),
        color: getColor("orange"),
        width: initialBrushSize / 2,
        points: interpolatePoints(generateCircle(width * 0.19, height * 0.15, width * 0.02)),
    });

    return strokes.map(stroke => ({
        ...stroke,
        length: calculateStrokeLengthInPixels(stroke.points),
    }));
};
  