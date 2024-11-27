import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface DrawingEvaluationPopupProps {
  onRestart: () => void; 
};

const DrawingEvaluationPopup: React.FC<DrawingEvaluationPopupProps> = ({ onRestart }) => {
  const [selectedStars, setSelectedStars] = useState<number>(0);

  const getMessage = () => {
    if (selectedStars >= 4) {
      return 'Parabéns, vocês chegaram bem perto do desenho original!';
    } else if (selectedStars >= 2) {
      return 'O resultado não foi ruim, mas ainda poderia ser melhor';
    } else if (selectedStars === 1) {
      return 'O resultado foi ruim, mas continuem treinando!';
    }
    return ''; 
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center'>
        <h2 className='text-lg font-semibold text-black mb-4'>
          Avalie a tentativa do desenho colaborativo para imitar o desenho original
        </h2>
        <div className='flex justify-center mb-4'>
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
              key={index}
              size={30}
              onClick={() => setSelectedStars(index + 1)}
              className={`cursor-pointer transition duration-200 ${
                selectedStars > index ? 'text-purple-700' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        {selectedStars > 0 && (
          <p className='text-sm text-black font-medium mb-4'>
            {getMessage()}
          </p>
        )}
        <button
          onClick={onRestart}
          className='bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300'
        >
          Avaliação do Som
        </button>
      </div>
    </div>
  );
};

export default DrawingEvaluationPopup;
