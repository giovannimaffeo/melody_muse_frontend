import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDrawingContext } from '../context/DrawingContext';
import DrawingCanvas from '../components/DrawingCanvas';
import { Stroke } from '../interfaces/stroke';
import OutlineButton from '../components/OutlineButton';
import FilledButton from '../components/FilledButton';
import CollaborativeDrawingCanvas from '../components/CollaborativeDrawingCanvas';

const EvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetStrokes, setTargetStrokes, collaborativeStrokes } = useDrawingContext();
  const [visualizationMode, setVisualizationMode] = useState<'target' | 'collaborative'>('target');
  const isTargetVisualizationMode = visualizationMode === 'target';

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

  const getCanvas = () => {
    if (isTargetVisualizationMode) {
      return (
        <DrawingCanvas 
          addCompletedStrokes={addCompletedStrokes} 
          removeCompletedStroke={removeCompletedStroke} 
          removeAllCompletedStrokes={removeAllCompletedStrokes}
          readOnlyStrokes={targetStrokes}
        />
      );
    } else {
      return (
        <CollaborativeDrawingCanvas
          addCompletedStrokes={addCompletedStrokes} 
          removeCompletedStroke={removeCompletedStroke} 
          removeAllCompletedStrokes={removeAllCompletedStrokes}
          readOnlyStrokes={collaborativeStrokes}
        />
      );
    };
  };

  return (
    <>
      {getCanvas()}
      <OutlineButton 
        title={isTargetVisualizationMode ? 'Desenho colaborativo' : 'Desenho alvo'}
        onClick={() => setVisualizationMode(isTargetVisualizationMode ? 'collaborative' : 'target')} 
      />
      <FilledButton title='Avaliar desenho' onClick={() => console.log("oi")} />
    </>
  );
};

export default EvaluationPage;
