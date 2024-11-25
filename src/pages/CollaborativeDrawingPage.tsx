import React, { useState } from 'react';

import DrawingCanvas from '../components/DrawingCanvas';
import FinishDrawButton from '../components/FinishDrawButton';
import Timer from '../components/Timer';
import CollaborativePopup from '../components/CollaborativePopup';
import { useDrawingContext } from '../context/DrawingContext';
import { Stroke } from '../interfaces/stroke';
import { calculateTimeForCollaborative } from '../constants/calculateTimeForCollaborative';

const CollaborativeDrawingPage: React.FC = () => {
  const { targetStrokes, collaborativeStrokes, setCollaborativeStrokes } = useDrawingContext();
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [finishDrawing, setFinishDrawing] = useState(false);
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
          onClose={() => console.log('Infelizmente, o tempo para reproduzir o desenho alvo terminou 😭')} 
        />
      }
      {finishDrawing && 
        <CollaborativePopup 
          title="Parabéns! Vocês conseguiram terminar o desenho antes do tempo finalizar 🎉"
          onClose={() => console.log('Parabéns! Vocês conseguiram terminar o desenho antes do tempo finalizar')} 
        />
      }
      <div className='grid grid-cols-2 grid-rows-2 h-full w-full'>
        <div className='border border-black'>
          <DrawingCanvas  
            addCompletedStrokes={addCompletedStrokes}
            removeCompletedStroke={removeCompletedStroke}
            removeAllCompletedStrokes={removeAllCompletedStrokes}
            isFullSize={false} 
          />
        </div>
        <div className='border border-black'>
          <DrawingCanvas  
            addCompletedStrokes={addCompletedStrokes}
            removeCompletedStroke={removeCompletedStroke}
            removeAllCompletedStrokes={removeAllCompletedStrokes}
            isFullSize={false} 
          />
        </div>
        <div className='border border-black'>
          <DrawingCanvas  
            addCompletedStrokes={addCompletedStrokes}
            removeCompletedStroke={removeCompletedStroke}
            removeAllCompletedStrokes={removeAllCompletedStrokes}
            isFullSize={false} 
          />
        </div>
        <div className='border border-black'>
          <DrawingCanvas  
            addCompletedStrokes={addCompletedStrokes}
            removeCompletedStroke={removeCompletedStroke}
            removeAllCompletedStrokes={removeAllCompletedStrokes}
            isFullSize={false} 
          />
        </div>
      </div>
      <FinishDrawButton onClick={() => setFinishDrawing(true)} />
    </div>
  );
};

export default CollaborativeDrawingPage;
