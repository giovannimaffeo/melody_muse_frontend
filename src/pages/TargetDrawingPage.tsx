import React, { useState, useEffect } from 'react';

import { useDrawingContext } from '../context/DrawingContext';
import DrawingCanvas from '../components/DrawingCanvas';
import FilledButton from '../components/FilledButton';
import { Stroke } from '../interfaces/stroke';
import DrawingOptionsPopup from '../components/DrawingOptionsPopup';

import { generateHouseWithGarden } from '../constants/drawingGenerators/generateHouseWithGarden';
import { generateBoatInOcean } from '../constants/drawingGenerators/generateBoatInOcean';
import { generateBoyKickingBall } from '../constants/drawingGenerators/generateBoyKickingBall';
import { generateCityscape } from '../constants/drawingGenerators/generateCityscape';
import { generateChurch } from '../constants/drawingGenerators/generateChurch';
import { generateTrain } from '../constants/drawingGenerators/generateTrain';
import { DrawingOption } from '../interfaces/drawingOption';
import FinishDrawingPopup from '../components/FinishDrawingPopup';

const TargetDrawingPage: React.FC = () => {
  const { targetStrokes, setTargetStrokes } = useDrawingContext();
  const [showDrawingOptions, setShowDrawingOptions] = useState(false);
  const [showFinishDrawing, setShowFinishDrawing] = useState(false);
  const [drawingOptions, setDrawingOptions] = useState<DrawingOption[]>([]);

  const handleGenerator = (generator: (width: number, height: number) => Stroke[]) => {
    setTargetStrokes(generator(window.innerWidth, window.innerHeight));
  };

  // Define opções padrão de desenhos
  useEffect(() => {
    const defaultOptions: DrawingOption[] = [
      { id: '1', name: 'Casa com Jardim', onClick: () => handleGenerator(generateHouseWithGarden) },
      { id: '2', name: 'Barco no Oceano', onClick: () => handleGenerator(generateBoatInOcean) },
      { id: '3', name: 'Cidade Moderna', onClick: () => handleGenerator(generateCityscape) },
      { id: '4', name: 'Trem', onClick: () => handleGenerator(generateTrain) },
      { id: '5', name: 'Igreja', onClick: () => handleGenerator(generateChurch) },
      { id: '6', name: 'Menino jogando Futebol', onClick: () => handleGenerator(generateBoyKickingBall) },
    ];

    // Carrega templates salvos no localStorage
    const templates: DrawingOption[] = Object.keys(localStorage)
      .filter(key => key.startsWith('desenho-')) // Filtra apenas chaves com prefixo "desenho-"
      .map(key => ({
        id: key,
        name: `Desenho ${key.split('-')[1]}`, // Exibe como "Desenho X"
        onClick: () => {
          const storedStrokes = localStorage.getItem(key);
          if (storedStrokes) {
            setTargetStrokes(JSON.parse(storedStrokes));
          }
        },
      }));

    // Combina opções padrão com templates do localStorage
    setDrawingOptions([...defaultOptions, ...templates]);
  }, [setTargetStrokes]);

  const handleFinishDrawing = () => {
    setShowFinishDrawing(true);
  };

  const addCompletedStrokes = (completedStrokes: Stroke[]) => {
    setTargetStrokes([...targetStrokes, ...completedStrokes]);
  };

  const removeCompletedStroke = (stroke: Stroke) => {
    setTargetStrokes(() =>
      targetStrokes.filter(targetStroke => targetStroke.id !== stroke.id)
    );
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
      {showFinishDrawing && (
        <FinishDrawingPopup
          targetStrokes={targetStrokes}
        />
      )}
      <DrawingCanvas
        strokes={targetStrokes}
        addCompletedStrokes={addCompletedStrokes}
        removeCompletedStroke={removeCompletedStroke}
        removeAllCompletedStrokes={removeAllCompletedStrokes}
        refreshOnChangeStrokes={true}
      />
      <div className="flex space-x-4">
        <FilledButton
          classname="!right-[240px]"
          title="Exemplos de Desenhos"
          onClick={() => setShowDrawingOptions(true)}
        />
        <FilledButton title="Finalizar Desenho" onClick={handleFinishDrawing} />
      </div>
    </>
  );
};

export default TargetDrawingPage;
