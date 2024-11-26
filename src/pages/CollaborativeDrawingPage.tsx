import React, { useState } from 'react';
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
          onClose={() => navigate('/evaluation')} 
        />
      }
      {finishDrawing && 
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
      <FilledButton title='Finalizar desenho' onClick={() => setFinishDrawing(true)} />
    </div>
  );
};

export default CollaborativeDrawingPage;
