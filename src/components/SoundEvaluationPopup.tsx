import React, { useRef, useState } from 'react';
import { FaStar, FaPlay, FaPause } from 'react-icons/fa';
import { useDrawingContext } from '../context/DrawingContext';
import { Stroke } from '../interfaces/stroke';
import { playStrokeAudioByDuration } from '../constants/playStrokeAudioByDuration';

interface SoundEvaluationPopupProps {
  onRestart: () => void;
}

const SoundEvaluationPopup: React.FC<SoundEvaluationPopupProps> = ({
  onRestart,
}) => {
  const { targetStrokesSound, collaborativeStrokesSound } = useDrawingContext();
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [isPlayingCollaborative, setIsPlayingCollaborative] = useState(false);

  const isPlayingTargetRef = useRef(false);
  const isPlayingCollaborativeRef = useRef(false);

  const calculateAccuracy = (): number => {
    let matchingStrokes = 0;

    for (let i = 0; i < targetStrokesSound.length; i++) {
      if (
        collaborativeStrokesSound[i] &&
        collaborativeStrokesSound[i].id === targetStrokesSound[i].id
      ) {
        matchingStrokes++;
      }
    }

    return (matchingStrokes / targetStrokesSound.length) * 100;
  };

  const getStarRating = (accuracy: number): number => {
    if (accuracy >= 80) return 5;
    if (accuracy >= 60) return 4;
    if (accuracy >= 40) return 3;
    if (accuracy >= 20) return 2;
    return 1;
  };

  const accuracy = calculateAccuracy();
  const starRating = getStarRating(accuracy);

  const getMessage = (): string => {
    if (starRating >= 4) {
      return 'Parabéns, vocês acertaram ou chegaram perto do som original!';
    } else if (starRating >= 2) {
      return 'O resultado não foi ruim, mas ainda poderia ser melhor!';
    } else {
      return 'O resultado foi ruim, mas continuem treinando!';
    }
  };

  const handlePlaySound = async (strokes: Stroke[], isTarget: boolean) => {
    if (isTarget && isPlayingCollaborativeRef.current) {
      handleStopSound(false); 
    } else if (!isTarget && isPlayingTargetRef.current) {
      handleStopSound(true); 
    };

    const ref = isTarget ? isPlayingTargetRef : isPlayingCollaborativeRef;
    const setIsPlaying = isTarget ? setIsPlayingTarget : setIsPlayingCollaborative;

    setIsPlaying(true);
    ref.current = true;

    for (const stroke of strokes) {
      await playStrokeAudioByDuration(stroke, ref);
    };

    setIsPlaying(false);
    ref.current = false;
  };

  const handleStopSound = (isTarget: boolean) => {
    const ref = isTarget ? isPlayingTargetRef : isPlayingCollaborativeRef;
    const setIsPlaying = isTarget ? setIsPlayingTarget : setIsPlayingCollaborative;

    ref.current = false;
    setIsPlaying(false);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center'>
        <h2 className='text-lg font-semibold text-black mb-4'>
          Avaliação do Som
        </h2>
        <div className='flex justify-center mb-4'>
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
              key={index}
              size={30}
              className={`transition duration-200 ${
                starRating > index ? 'text-purple-700' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className='text-sm text-black font-medium mb-4'>{getMessage()}</p>
        <div className='flex justify-between items-center mb-6 px-6'>
          <button
            onClick={() =>
              isPlayingTarget
                ? handleStopSound(true)
                : handlePlaySound(targetStrokesSound, true)
            }
            className="flex items-center border bg-transparent border-purple-700 text-purple-700 px-4 py-2 rounded-lg shadow-md hover:bg-purple-100 hover:border-purple-600 hover:text-purple-600 transition duration-300"
          >
            {isPlayingTarget ? (
              <>
                <FaPause className="mr-2" />
                Pausar Alvo
              </>
            ) : (
              <>
                <FaPlay className="mr-2" />
                Ouvir Alvo
              </>
            )}
          </button>
          <button
            onClick={() =>
              isPlayingCollaborative
                ? handleStopSound(false)
                : handlePlaySound(collaborativeStrokesSound, false)
            }
            className="flex items-center border bg-transparent border-purple-700 text-purple-700 px-4 py-2 rounded-lg shadow-md hover:bg-purple-100 hover:border-purple-600 hover:text-purple-600 transition duration-300"
          >
            {isPlayingCollaborative ? (
              <>
                <FaPause className="mr-2" />
                Pausar Colaborativo
              </>
            ) : (
              <>
                <FaPlay className="mr-2" />
                Ouvir Colaborativo
              </>
            )}
          </button>
        </div>
        <button
          onClick={() => {onRestart(); handleStopSound(true); handleStopSound(false);}}
          className='bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300'
        >
          Reiniciar Jogo
        </button>
      </div>
    </div>
  );
};

export default SoundEvaluationPopup;
