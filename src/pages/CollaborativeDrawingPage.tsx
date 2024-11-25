import React from 'react';

import DrawingCanvas from '../components/DrawingCanvas';
import FinishDrawButton from '../components/FinishDrawButton';

const CollaborativeDrawingPage: React.FC = () => {
  const onClick = () => {
    console.log('Passar página para comparação');
  };

  return (
    <div className='overflow-hidden h-screen w-screen'>
      <div className='grid grid-cols-2 grid-rows-2 h-full w-full'>
        <div className='border border-black'>
          <DrawingCanvas isFullSize={false} />
        </div>
        <div className='border border-black'>
          <DrawingCanvas isFullSize={false} />
        </div>
        <div className='border border-black'>
          <DrawingCanvas isFullSize={false} />
        </div>
        <div className='border border-black'>
          <DrawingCanvas isFullSize={false} />
        </div>
      </div>
      <FinishDrawButton onClick={onClick} />
    </div>
  );
};

export default CollaborativeDrawingPage;
