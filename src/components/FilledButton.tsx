import React from 'react';

interface FilledButtonProps {
  title: string;
  onClick: () => void; 
  right?: number;
  classname?: string;
};

const FilledButton: React.FC<FilledButtonProps> = ({ title, onClick, right = 48, classname = '' }) => {
  return (
    <button
      style={{ right }}
      className={`absolute right-12 bottom-8 bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-200 ${classname}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default FilledButton;