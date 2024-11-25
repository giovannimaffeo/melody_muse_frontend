import React from 'react';
import { useNavigate } from 'react-router-dom';

import DrawingCanvas from '../components/DrawingCanvas';
import FinishDrawButton from '../components/FinishDrawButton';

const TargetDrawingPage: React.FC = () => {
  const navigate = useNavigate();

  const onClick = () => {
    console.log('passar página para colaborativo')
    navigate('/collaborative-drawing');
  };

  return (
    <>
      <DrawingCanvas />
      <FinishDrawButton onClick={onClick} />
    </>
  );
};

export default TargetDrawingPage;
