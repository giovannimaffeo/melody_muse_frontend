import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useDrawingContext } from '../context/DrawingContext';
import DrawingCanvas from '../components/DrawingCanvas';
import FinishDrawButton from '../components/FinishDrawButton';
import { Stroke } from '../interfaces/stroke';

const TargetDrawingPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetStrokes, setTargetStrokes } = useDrawingContext();

  const onClick = () => {
    navigate('/cutdown');
  };

  const addCompletedStrokes = (completedStrokes: Stroke[]) => {
    setTargetStrokes([...targetStrokes, ...completedStrokes]);
  };

  const removeCompletedStroke = (stroke: Stroke) => {
    setTargetStrokes(() => targetStrokes.filter((targetStroke) => targetStroke.id !== stroke.id));
  };

  const removeAllCompletedStrokes = () => {
    setTargetStrokes([]);
  };

  return (
    <>
      <DrawingCanvas 
        addCompletedStrokes={addCompletedStrokes} 
        removeCompletedStroke={removeCompletedStroke} 
        removeAllCompletedStrokes={removeAllCompletedStrokes}
      />
      <FinishDrawButton onClick={onClick} />
    </>
  );
};

export default TargetDrawingPage;
