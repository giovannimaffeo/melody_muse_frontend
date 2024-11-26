import React from 'react';

interface FilledButtonProps {
  title: string;
  onClick: () => void; 
};

const FilledButton: React.FC<FilledButtonProps> = ({ title, onClick }) => {
  return (
    <button
      className='absolute right-12 bottom-8 bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-200'
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default FilledButton;