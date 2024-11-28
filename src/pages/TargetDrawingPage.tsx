import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDrawingContext } from '../context/DrawingContext';
import DrawingCanvas from '../components/DrawingCanvas';
import FilledButton from '../components/FilledButton';
import { Stroke } from '../interfaces/stroke';
import DrawingOptionsPopup from '../components/DrawingOptionsPopup';

import { generateHouseWithGarden } from '../constants/drawingGenerators/generateHouseWithGarden';
import { generateBoatInOcean } from '../constants/drawingGenerators/generateBoatInOcean';
import { generateBoyKickingBall } from '../constants/drawingGenerators/generateBoyKickingBall ';
import { generateCityscape } from '../constants/drawingGenerators/generateCityscape';
import { generateChurch } from '../constants/drawingGenerators/generateChurch';
import { generateTrain } from '../constants/drawingGenerators/generateTrain';
import { DrawingOption } from '../interfaces/drawingOption';

const TargetDrawingPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetStrokes, setTargetStrokes } = useDrawingContext();
  const [showDrawingOptions, setShowDrawingOptions] = useState(false);

  const handleGenerator = (generator: (width: number, height: number) => Stroke[]) => {
    setTargetStrokes(generator(screen.width, screen.height));
  };

  const drawingOptions: DrawingOption[] = [
    { id: '1', name: 'Casa com Jardim', onClick: () => handleGenerator(generateHouseWithGarden) },
    { id: '2', name: 'Barco no Oceano', onClick: () => handleGenerator(generateBoatInOcean) },
    { id: '3', name: 'Cidade Moderna', onClick: () => handleGenerator(generateCityscape) },
    { id: '4', name: 'Trem', onClick: () => handleGenerator(generateTrain) },
    { id: '5', name: 'Igreja', onClick: () => handleGenerator(generateChurch) },
    { id: '6', name: 'Menino jogando Futebol', onClick: () => handleGenerator(generateBoyKickingBall) },
  ];

  const onClick = () => {
    navigate('/target-sound');
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
      {showDrawingOptions && (
        <DrawingOptionsPopup
          title="Templates de Desenhos"
          options={drawingOptions}
          onClose={() => setShowDrawingOptions(false)}
        />
      )}
      <DrawingCanvas 
        strokes={targetStrokes}
        addCompletedStrokes={addCompletedStrokes} 
        removeCompletedStroke={removeCompletedStroke} 
        removeAllCompletedStrokes={removeAllCompletedStrokes}
      />
      <div>
        <FilledButton classname='!right-[240px]' title='Exemplos desenhos' onClick={() => setShowDrawingOptions(true)} />
        <FilledButton title='Finalizar desenho' onClick={onClick} />
      </div>
    </>
  );
};

export default TargetDrawingPage;
