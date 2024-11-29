import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stroke } from '../interfaces/stroke';

interface FinishDrawingPopupProps {
  targetStrokes: Stroke[];
};

const FinishDrawingPopup: React.FC<FinishDrawingPopupProps> = ({
  targetStrokes
}) => {
  const navigate = useNavigate();

  const handleSaveTemplate = () => {
    const localStorageKey = 'desenho-';
    let templateCount = 0;

    // Conta o número de templates existentes
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(localStorageKey)) {
        templateCount++;
      };
    });

    // Salva o desenho como novo template
    const newTemplateName = `${localStorageKey}${templateCount + 1}`;
    localStorage.setItem(newTemplateName, JSON.stringify(targetStrokes));

		handleContinue();
  };

  const handleContinue = () => {
    navigate('/target-sound');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center">
        <h2 className="text-lg font-semibold text-black mb-4">
          Finalizar Desenho
        </h2>
        <p className="text-black text-sm mb-6">
          Deseja salvar o desenho como template ou continuar para a próxima etapa?
        </p>
        <div className="flex justify-between items-center px-6">
          <button
            onClick={handleSaveTemplate}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
          >
            Salvar como Template
          </button>
          <button
            onClick={handleContinue}
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-400 transition duration-300"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishDrawingPopup;
