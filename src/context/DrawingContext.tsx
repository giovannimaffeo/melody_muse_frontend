import React, { createContext, useState, useContext, ReactNode } from 'react';

import { Stroke } from '../interfaces/stroke';

interface DrawingContextProps {
  targetStrokes: Stroke[];
  setTargetStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
  collaborativeStrokes: Stroke[];
  setCollaborativeStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
};

const DrawingContext = createContext<DrawingContextProps | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [targetStrokes, setTargetStrokes] = useState<Stroke[]>([]);
  const [collaborativeStrokes, setCollaborativeStrokes] = useState<Stroke[]>([]);

  return (
    <DrawingContext.Provider
      value={{ targetStrokes, setTargetStrokes, collaborativeStrokes, setCollaborativeStrokes }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawingContext = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error('useDrawingContext deve ser usado dentro de um DrawingProvider');
  };

  return context;
};
