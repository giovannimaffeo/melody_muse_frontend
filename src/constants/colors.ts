import { Color } from '../interfaces/color';

export const colors: Color[] = [
	{
		name: 'red',
		tailwind: 'red-500',
		hex: '#ef4444',
		sound: new Audio('/assets/sounds/RED.wav')
	},
	{
		name: 'orange',
		tailwind: 'orange-500',
		hex: '#f97316',
		sound: new Audio('/assets/sounds/ORANGE.wav')
	},
	{
		name: 'yellow',
		tailwind: 'yellow-500',
		hex: '#eab308',
		sound: new Audio('/assets/sounds/YELLOW.wav')
	},
	{
		name: 'green',
		tailwind: 'green-500',
		hex: '#22c55e',
		sound: new Audio('/assets/sounds/GREEN.wav')
	},
	{
		name: 'blue',
		tailwind: 'blue-500',
		hex: '#3b82f6',
		sound: new Audio('/assets/sounds/BLUE.wav')
	},
	{
		name: 'pink',
		tailwind: 'pink-500',
		hex: '#ec4899',
		sound: new Audio('/assets/sounds/PINK.wav')
	},
	{
		name: 'purple',
		tailwind: 'purple-500',
		hex: '#a855f7',
		sound: new Audio('/assets/sounds/PURPLE.wav')
	}
];