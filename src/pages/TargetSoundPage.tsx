import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDrawingContext } from '../context/DrawingContext';
import DrawingCanvas from '../components/DrawingCanvas';
import FilledButton from '../components/FilledButton';
import { Stroke } from '../interfaces/stroke';
import OutlineButton from '../components/OutlineButton';
import { playStrokeAudioByDuration } from '../constants/playStrokeAudioByDuration';

const TargetSoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetStrokes, targetStrokesSound, setTargetStrokesSound } = useDrawingContext();
  const isTargetStrokesSoundComplete = targetStrokes.length === targetStrokesSound.length;

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
      if (!isPlayingRef.current) break; 
      await playStrokeAudioByDuration(stroke);
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
