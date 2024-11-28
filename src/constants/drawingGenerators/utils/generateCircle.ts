export const generateCircle = (centerX: number, centerY: number, radius: number, steps: number = 36) => {
	const points: { x: number; y: number }[] = [];
	for (let i = 0; i <= steps; i++) {
		const angle = (2 * Math.PI * i) / steps;
		points.push({
			x: centerX + radius * Math.cos(angle),
			y: centerY + radius * Math.sin(angle),
		});
	};
	return points;
};