import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDrawingContext } from '../context/DrawingContext';
import DrawingCanvas from '../components/DrawingCanvas';
import FilledButton from '../components/FilledButton';
import { Stroke } from '../interfaces/stroke';
import { playStrokeAudioByDuration } from '../constants/playStrokeAudioByDuration';
import SoundInstructionsPopup from '../components/SoundInstructionsPopup';

const TargetSoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetStrokes, targetStrokesSound, setTargetStrokesSound } = useDrawingContext();
  const isTargetStrokesSoundComplete = targetStrokes.length === targetStrokesSound.length;
  const [showInstructions, setShowInstructions] = useState(true); 

  const [isPlaying, setIsPlaying] = useState(false); 
  const isPlayingRef = useRef(false); 

  const addStrokeSound = (stroke: Stroke) => {
    const isStrokeAlreadyAdded = targetStrokesSound.some(existingStroke => existingStroke.id === stroke.id);

    if (!isStrokeAlreadyAdded) {
      setTargetStrokesSound([...targetStrokesSound, stroke]);
    };
  };

  const handlePlaySound = async () => {
    setIsPlaying(true);
    isPlayingRef.current = true; 

    for (const stroke of targetStrokesSound) {
      await playStrokeAudioByDuration(stroke, isPlayingRef);
      if (!isPlayingRef.current) break;
    };

    setIsPlaying(false);
    isPlayingRef.current = false; 
  };

  const handleStopSound = () => {
    setIsPlaying(false);
    isPlayingRef.current = false; 
  };

  const handleFinishSound = () => {
    handleStopSound(); 
    navigate('/countdown');
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
          <FilledButton
            classname='!right-[220px]' 
            title={isPlaying ? 'Parar som' : 'Reproduzir som'} 
            onClick={isPlaying ? handleStopSound : handlePlaySound} 
          />
          <FilledButton title='Finalizar som' onClick={handleFinishSound} />
        </>
      )}
    </>
  );
};

export default TargetSoundPage;
