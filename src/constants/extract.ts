import { Color } from "../interfaces/color";
import { Stroke } from "../interfaces/stroke";

export const parseStrokesFromJson = (
    jsonData: any,
    colors: Color[]
): Stroke[] => {
    const colorMap = colors.reduce((map, color) => {
        map[color.name] = color;
        return map;
    }, {} as Record<string, Color>);

    // Converte o JSON em Strokes
    const strokes: Stroke[] = jsonData.map((strokeData: any) => {
        const color = colorMap[strokeData.color];
        if (!color) {
            throw new Error(`Color ${strokeData.color} not found in the provided colors list.`);
        }

        return {
            id: strokeData.id,
            color: color,
            width: 2, // Ajuste a largura conforme necessário
            points: strokeData.points.map((point: any) => ({
                x: point.x,
                y: point.y,
            }))
        };
    });

    return strokes;
};