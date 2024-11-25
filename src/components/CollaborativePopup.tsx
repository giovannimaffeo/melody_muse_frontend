import React from 'react';

interface CollaborativePopupProps {
	title: string;
  onClose: () => void;
};

const CollaborativePopup: React.FC<CollaborativePopupProps> = ({ title, onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center'>
        <h2 className='text-lg font-semibold text-black mb-4'>
          {title}
        </h2>
        <p className='text-black text-sm mb-6'>
          Pressione <strong>Continuar</strong> para navegar para a tela de comparação onde o desenhista inicial irá avaliá-los
        </p>
        <button
          onClick={onClose}
          className='bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300'
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default CollaborativePopup;
