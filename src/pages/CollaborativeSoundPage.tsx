import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDrawingContext } from '../context/DrawingContext';
import DrawingCanvas from '../components/DrawingCanvas';
import FilledButton from '../components/FilledButton';
import { Stroke } from '../interfaces/stroke';
import SoundInstructionsPopup from '../components/SoundInstructionsPopup';

const CollaborativeSoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetStrokes, collaborativeStrokesSound, setCollaborativeStrokesSound } = useDrawingContext();
  const isTargetStrokesSoundComplete = targetStrokes.length === collaborativeStrokesSound.length;
  const [showInstructions, setShowInstructions] = useState(true); 

  const addStrokeSound = (stroke: Stroke) => {
    const isStrokeAlreadyAdded = collaborativeStrokesSound.some(existingStroke => existingStroke.id === stroke.id);
  
    if (!isStrokeAlreadyAdded) {
      setCollaborativeStrokesSound([...collaborativeStrokesSound, stroke]);
    };
  };  

  const handleFinishSound = () => {
    navigate('/evaluation');
  };

  useEffect(() => {
    setShowInstructions(true); 
  }, []);

  return (
    <>
      {showInstructions && (
        <SoundInstructionsPopup onClose={() => setShowInstructions(false)} />
      )}
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
