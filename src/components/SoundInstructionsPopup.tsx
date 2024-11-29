import React from 'react';

interface SoundInstructionsPopupProps {
  onClose: () => void;
};

const SoundInstructionsPopup: React.FC<SoundInstructionsPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center">
        <h2 className="text-lg font-semibold text-black mb-4">Instruções para o Desafio do Som</h2>
        <p className="text-black text-sm mb-4 px-2">
          Cada traço do desenho está associado a um som único, definido por sua cor.
          Reproduza a música tocando nos traços em ordem!
        </p>
        <button
          onClick={onClose}
          className="bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default SoundInstructionsPopup;
