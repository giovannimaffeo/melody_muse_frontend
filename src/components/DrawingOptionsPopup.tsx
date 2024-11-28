import React from 'react';

import { DrawingOption } from '../interfaces/drawingOption';

interface DrawingOptionsPopupProps {
  title: string;
  options: DrawingOption[];
  onClose: () => void;
};

const DrawingOptionsPopup: React.FC<DrawingOptionsPopupProps> = ({ title, options, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center">
        <h2 className="text-lg font-semibold text-black mb-4">{title}</h2>
        <p className="text-black text-sm mb-6">
          Essas são algumas opções de exemplos de template de desenhos para ajudá-lo. Clique em um deles para começar e sinta-se para editar!
        </p>
        <div className="overflow-y-auto max-h-[200px] border rounded-md p-2">
          {options.map(option => (
            <button
              key={option.id}
              onClick={option.onClick}
              className="bg-purple-100 text-black text-sm font-medium w-full py-2 my-1 rounded-lg hover:bg-purple-200 transition duration-300"
            >
              {option.name}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default DrawingOptionsPopup;
