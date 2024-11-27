import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDrawingContext } from '../context/DrawingContext';
import DrawingCanvas from '../components/DrawingCanvas';
import { Stroke } from '../interfaces/stroke';
import OutlineButton from '../components/OutlineButton';
import FilledButton from '../components/FilledButton';
import EvaluationPopup from '../components/EvaluationPopup';

const EvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetStrokes, setTargetStrokes, collaborativeStrokes, setCollaborativeStrokes } = useDrawingContext();
  const [visualizationMode, setVisualizationMode] = useState<'target' | 'collaborative'>('target');
  const isTargetVisualizationMode = visualizationMode === 'target';
  const [showEvaluation, setShowEvaluation] = useState(false);

  const addCompletedStrokes = (completedStrokes: Stroke[]) => {
    setTargetStrokes([...targetStrokes, ...completedStrokes]);
  };

  const removeCompletedStroke = (stroke: Stroke) => {
    setTargetStrokes(() => targetStrokes.filter((targetStroke) => targetStroke.id !== stroke.id));
  };

  const removeAllCompletedStrokes = () => {
    setTargetStrokes([]);
  };

  const adjustStrokePoints = (strokes: Stroke[], screenWidth: number, screenHeight: number): Stroke[] => {
    const adjustedStrokes = strokes.map((stroke) => {
      if (stroke.screenIndex === undefined) return stroke; 

      const quadrantOffsets = [
        { x: 0, y: 0 }, 
        { x: screenWidth / 2, y: 0 }, 
        { x: 0, y: screenHeight / 2 }, 
        { x: screenWidth / 2, y: screenHeight / 2 }
      ];

      const offset = quadrantOffsets[stroke.screenIndex];

      const adjustedPoints = stroke.points.map((point) => ({
          x: point.x + offset.x,
          y: point.y + offset.y,
      }));

      return {
          ...stroke,
          points: adjustedPoints, 
      };
    });
    
    return adjustedStrokes;
  };

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const adjustedCollaborativeStrokes = adjustStrokePoints(collaborativeStrokes, screenWidth, screenHeight - screenHeight * 0.085);

  const getCanvas = () => {
    if (visualizationMode === 'target') {
      return (
        <DrawingCanvas 
          key='target'
          isFullSize={true}
          strokes={targetStrokes}
          addCompletedStrokes={addCompletedStrokes} 
          removeCompletedStroke={removeCompletedStroke} 
          removeAllCompletedStrokes={removeAllCompletedStrokes}
          isReadOnly={true}
        />
      );
    } else {
      return (
        <DrawingCanvas
          key='collaborative'
          isFullSize={true}
          strokes={adjustedCollaborativeStrokes}
          addCompletedStrokes={addCompletedStrokes} 
          removeCompletedStroke={removeCompletedStroke} 
          removeAllCompletedStrokes={removeAllCompletedStrokes}
          isReadOnly={true}
        />
      );
    };
  };

  const restart = () => {
    setTargetStrokes([]);
    setCollaborativeStrokes([]);
    navigate('/');
  };


  return (
    <>
      {showEvaluation && <EvaluationPopup onRestart={() => restart()} />}
      {getCanvas()}
      <OutlineButton 
        title={isTargetVisualizationMode ? 'Desenho colaborativo' : 'Desenho alvo'}
        onClick={() => setVisualizationMode(isTargetVisualizationMode ? 'collaborative' : 'target')} 
      />
      <FilledButton title='Avaliar desenho' onClick={() => setShowEvaluation(true)} />
    </>
  );
};

export default EvaluationPage;
