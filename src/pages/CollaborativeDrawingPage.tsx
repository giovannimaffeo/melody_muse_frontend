import React, { useState } from 'react';

import DrawingCanvas from '../components/DrawingCanvas';
import FinishDrawButton from '../components/FinishDrawButton';
import Timer from '../components/Timer';
import CollaborativePopup from '../components/TimeUpPopup';

const CollaborativeDrawingPage: React.FC = () => {
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [finishDrawing, setFinishDrawing] = useState(false);

  return (
    <div className='overflow-hidden h-screen w-screen'>
      <Timer 
        hours={0}
        minutes={1}
        seconds={30}
        onComplete={() => setShowTimeUp(true)}
      />
      {showTimeUp && 
        <CollaborativePopup 
          title="Infelizmente, o tempo para reproduzir o desenho alvo terminou 😭"
          onClose={() => console.log('Infelizmente, o tempo para reproduzir o desenho alvo terminou 😭')} 
        />
      }
      {finishDrawing && 
        <CollaborativePopup 
          title="Parabéns! Vocês conseguiram terminar o desenho antes do tempo finalizar 🎉"
          onClose={() => console.log('Parabéns! Vocês conseguiram terminar o desenho antes do tempo finalizar')} 
        />
      }
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
      <FinishDrawButton onClick={() => setFinishDrawing(true)} />
    </div>
  );
};

export default CollaborativeDrawingPage;
