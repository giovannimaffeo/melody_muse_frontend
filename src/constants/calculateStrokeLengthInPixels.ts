export const calculateStrokeLengthInPixels = (points: { x: number; y: number }[]) => {
	if (points.length < 2) return 0; 

	let length = 0;

	for (let i = 1; i < points.length; i++) {
		const p1 = points[i - 1];
		const p2 = points[i];

		const dx = p2.x - p1.x;
		const dy = p2.y - p1.y;

		const distance = Math.sqrt(dx * dx + dy * dy);
		length += distance;
	};

	return Math.round(length); 
};