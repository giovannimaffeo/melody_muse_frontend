import React from 'react';

interface FinishDrawButtonProps {
  onClick: () => void; 
};

const FinishDrawButton: React.FC<FinishDrawButtonProps> = ({ onClick }) => {
  return (
    <button
      className='absolute right-12 bottom-8 bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-200'
      onClick={onClick}
    >
      Finalizar desenho
    </button>
  );
};

export default FinishDrawButton;