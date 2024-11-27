import { Stroke } from "../interfaces/stroke";

export const playStrokeAudioByDuration = (stroke: Stroke): Promise<void> => {
	return new Promise((resolve) => {
		const audio = stroke.color.sound;
		const duration = stroke.soundDuration || 3; 

		if (audio) {
			const volumeRate = 1 / 50;
			audio.volume = stroke.width * volumeRate;
			audio.currentTime = 0;
			audio.play();

			setTimeout(() => {
				audio.pause();
				audio.currentTime = 0; 
				resolve();
			}, duration * 1000); 
		} else {
			resolve(); 
		};
	});
};