import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Timer from '../components/Timer';
import CollaborativePopup from '../components/CollaborativePopup';
import { useDrawingContext } from '../context/DrawingContext';
import { Stroke } from '../interfaces/stroke';
import { calculateTimeForCollaborative } from '../constants/calculateTimeForCollaborative';
import FilledButton from '../components/FilledButton';
import CollaborativeDrawingCanvas from '../components/CollaborativeDrawingCanvas';

const CollaborativeDrawingPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetStrokes, collaborativeStrokes, setCollaborativeStrokes } = useDrawingContext();
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [showFinishDrawing, setShowFinishDrawing] = useState(false);
  const { hours, minutes, seconds } = calculateTimeForCollaborative(targetStrokes);

  const addCompletedStrokes = (completedStrokes: Stroke[]) => {
    setCollaborativeStrokes([...collaborativeStrokes, ...completedStrokes]);
  };

  const removeCompletedStroke = (stroke: Stroke) => {
    setCollaborativeStrokes(() => collaborativeStrokes.filter((collaborativeStroke) => collaborativeStroke.id !== stroke.id));
  };

  const removeAllCompletedStrokes = () => {
    setCollaborativeStrokes([]);
  };

  const playStrokeSound = (stroke: Stroke): Promise<void> => {
    return new Promise((resolve) => {
      const audio = stroke.color.sound;
      if (audio) {
        const volumeRate = 1 / 50;
        audio.volume = stroke.width * volumeRate;
        audio.currentTime = 0;
        audio.play();

        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          resolve();
        }, 3000);
      } else {
        resolve(); 
      };
    });
  };

  const playTargetStrokes = async (stop: boolean) => {
    while (!stop) {
      for (const strokeToPlay of targetStrokes) {
        await playStrokeSound(strokeToPlay); 
      };
    };
  };

  useEffect(() => {
    playTargetStrokes(showFinishDrawing === true || showTimeUp === true);
  }, []);

  return (
    <div className='overflow-hidden h-screen w-screen'>
      <Timer 
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        onComplete={() => setShowTimeUp(true)}
      />
      {showTimeUp && 
        <CollaborativePopup 
          title="Infelizmente, o tempo para reproduzir o desenho alvo terminou 😭"
          onClose={() => navigate('/evaluation')} 
        />
      }
      {showFinishDrawing && 
        <CollaborativePopup 
          title="Parabéns! Vocês conseguiram terminar o desenho antes do tempo finalizar 🎉"
          onClose={() => navigate('/evaluation')} 
        />
      }
      <CollaborativeDrawingCanvas
        strokes={collaborativeStrokes}
        addCompletedStrokes={addCompletedStrokes}
        removeCompletedStroke={removeCompletedStroke}
        removeAllCompletedStrokes={removeAllCompletedStrokes}
      />
      <FilledButton title='Finalizar desenho' onClick={() => setShowFinishDrawing(true)} />
    </div>
  );
};

export default CollaborativeDrawingPage;
