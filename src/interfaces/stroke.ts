import { Color } from "./color";

export interface Stroke {
	id: string;
	color: Color;
	width: number; 
	points: { x: number; y: number }[]; 
	length?: number;
	screenIndex?: number;
};