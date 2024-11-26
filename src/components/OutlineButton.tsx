import React from 'react';

interface OutlineButtonProps {
  title: string;
  onClick: () => void; 
};

const OutlineButton: React.FC<OutlineButtonProps> = ({ title, onClick }) => {
  return (
    <button
      className='absolute right-56 bottom-8 border-2 bg-transparent border-purple-700 text-purple-700 font-semibold py-[7px] px-6 rounded-lg shadow-lg hover:bg-purple-100 transition duration-200'
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default OutlineButton;
