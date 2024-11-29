import { Stroke } from '../interfaces/stroke';

export const playStrokeAudioByDuration = (
  stroke: Stroke,
  isPlayingRef: React.MutableRefObject<boolean>
): Promise<void> => {
  return new Promise((resolve) => {
    const audio = stroke.color.sound;
    const duration = stroke.soundDuration || 3; // Tempo em segundos

    if (audio) {
      const volumeRate = 1 / 50;
      audio.volume = stroke.width * volumeRate;
      audio.currentTime = 0; // Recomeça o áudio do início
      audio.play(); // Começa a reprodução

      let timeoutId: any = null;
      const intervalId = setInterval(() => {
        if (!isPlayingRef.current) {
          // Se isPlayingRef for false, pausa o áudio e resolve
          if (timeoutId) clearTimeout(timeoutId); // Limpa o timeout para evitar execução precoce
          audio.pause();
          audio.currentTime = 0;
          clearInterval(intervalId);
          resolve();
        }
      }, 100); // Verifica o estado a cada 100ms

      // Define o tempo exato de reprodução
      timeoutId = setTimeout(() => {
        if (isPlayingRef.current) {
          // Se ainda está tocando, para o áudio normalmente
          audio.pause();
          audio.currentTime = 0;
        }
        clearInterval(intervalId); // Certifica-se de limpar o intervalo
        resolve(); // Resolve a Promise
      }, duration * 1000);
    } else {
      resolve(); // Resolve imediatamente se não houver áudio
    };
  });
};