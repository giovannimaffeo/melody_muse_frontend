import React from 'react';

import DrawingCanvas from '../components/DrawingCanvas';
import { Stroke } from '../interfaces/stroke';

interface CollaborativeDrawingCanvasProps {
	addCompletedStrokes: (completedStrokes: Stroke[]) => void;
	removeCompletedStroke: (stroke: Stroke) => void;
	removeAllCompletedStrokes: () => void;
	readOnlyStrokes?: Stroke[];
};

const CollaborativeDrawingCanvas: React.FC<CollaborativeDrawingCanvasProps> = ({
	addCompletedStrokes,
	removeCompletedStroke,
	removeAllCompletedStrokes,
	readOnlyStrokes
}) => {
  return (
    <div className='grid grid-cols-2 grid-rows-2 h-full w-full'>
			<div className='border border-black'>
				<DrawingCanvas  
					addCompletedStrokes={addCompletedStrokes}
					removeCompletedStroke={removeCompletedStroke}
					removeAllCompletedStrokes={removeAllCompletedStrokes}
					isFullSize={false}
					readOnlyStrokes={readOnlyStrokes} 
				/>
			</div>
			<div className='border border-black'>
				<DrawingCanvas  
					addCompletedStrokes={addCompletedStrokes}
					removeCompletedStroke={removeCompletedStroke}
					removeAllCompletedStrokes={removeAllCompletedStrokes}
					isFullSize={false}
					readOnlyStrokes={readOnlyStrokes} 
				/>
			</div>
			<div className='border border-black'>
				<DrawingCanvas  
					addCompletedStrokes={addCompletedStrokes}
					removeCompletedStroke={removeCompletedStroke}
					removeAllCompletedStrokes={removeAllCompletedStrokes}
					isFullSize={false}
					readOnlyStrokes={readOnlyStrokes} 
				/>
			</div>
			<div className='border border-black'>
				<DrawingCanvas  
					addCompletedStrokes={addCompletedStrokes}
					removeCompletedStroke={removeCompletedStroke}
					removeAllCompletedStrokes={removeAllCompletedStrokes}
					isFullSize={false}
					readOnlyStrokes={readOnlyStrokes} 
				/>
			</div>
    </div>
  );
};

export default CollaborativeDrawingCanvas;
