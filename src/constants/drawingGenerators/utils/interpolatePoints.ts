export const interpolatePoints = (points: { x: number; y: number }[], step: number = 5) => {
	const interpolatedPoints: { x: number; y: number }[] = [];

	for (let i = 0; i < points.length - 1; i++) {
		const start = points[i];
		const end = points[i + 1];

		const distance = Math.sqrt(
			Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
		);
		const steps = Math.max(Math.floor(distance / step), 1);

		for (let j = 0; j <= steps; j++) {
			interpolatedPoints.push({
				x: start.x + ((end.x - start.x) * j) / steps,
				y: start.y + ((end.y - start.y) * j) / steps,
			});
		};
	};
  
	return interpolatedPoints;
};