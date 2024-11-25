import { Stroke } from "../interfaces/stroke";

export const calculateTimeForCollaborative = (strokes: Stroke[]) => {
	const baseTimePerPixel = 0.005; 
	const widthMultiplier = 0.2; 
	const initialTime = 0; 

	const totalLength = strokes.reduce((sum, stroke) => {
		const length =
			stroke.length ??
			stroke.points.reduce((len, point, index) => {
				if (index === 0) return len;
				const prev = stroke.points[index - 1];
				const dx = point.x - prev.x;
				const dy = point.y - prev.y;
				return len + Math.sqrt(dx * dx + dy * dy);
			}, 0);

		return sum + length;
	}, 0);

	const totalTimeInSeconds =
		initialTime +
		totalLength * baseTimePerPixel +
		strokes.reduce((sum, stroke) => sum + stroke.width * widthMultiplier, 0);

	const hours = Math.floor(totalTimeInSeconds / 3600);
	const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
	const seconds = Math.floor(totalTimeInSeconds % 60);
  
  return { hours, minutes, seconds };
  };