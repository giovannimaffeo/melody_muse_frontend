import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useDrawingContext } from '../context/DrawingContext';
import DrawingCanvas from '../components/DrawingCanvas';
import FilledButton from '../components/FilledButton';
import { Stroke } from '../interfaces/stroke';

const CollaborativeSoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetStrokes, collaborativeStrokesSound, setCollaborativeStrokesSound } = useDrawingContext();
  const isTargetStrokesSoundComplete = targetStrokes.length === collaborativeStrokesSound.length;

  const addStrokeSound = (stroke: Stroke) => {
    const isStrokeAlreadyAdded = collaborativeStrokesSound.some(existingStroke => existingStroke.id === stroke.id);
  
    if (!isStrokeAlreadyAdded) {
      setCollaborativeStrokesSound([...collaborativeStrokesSound, stroke]);
    };
  };  

  const handleFinishSound = () => {
    navigate('/evaluation');
  };

  return (
    <>
      <DrawingCanvas 
        isFullSize={true}
        strokes={targetStrokes} 
        mode='sound'
        addStrokeSound={addStrokeSound}
      />
      {isTargetStrokesSoundComplete && (
        <>
          <FilledButton title='Finalizar som' onClick={handleFinishSound} />
        </>
      )}
    </>
  );
};

export default CollaborativeSoundPage;
