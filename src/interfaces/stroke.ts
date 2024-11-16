import { Color } from "./color";

export interface Stroke {
	color: Color;
	width: number; 
	points: { x: number; y: number }[]; 
	length?: number;
};