import React from 'react';

import { ColorOption } from '../interfaces/colorOption';

interface DrawingToolMenuProps {
  colorOptions: ColorOption[];
  brushSize: number;
  setBrushSize: (size: number) => void;
  setColor: (color: ColorOption) => void;
};

const DrawingToolMenu: React.FC<DrawingToolMenuProps> = ({ 
  colorOptions, 
  brushSize, 
  setBrushSize, 
  setColor 
}) => {
  const handleColorClick = (colorOption: ColorOption) => {
    setColor(colorOption); 
    
    // Optional sound logic
    /*if (colorOption.sound) {
      colorOption.sound.currentTime = 0; 
      colorOption.sound.play();
    }*/
  };

  return (
    <div className='absolute top-[6%] left-[0.5%] bg-gray-700 text-white p-4 rounded-lg shadow-lg flex flex-col gap-4'>
      <div className='flex items-center'>
        <input
          type='range'
          min='1'
          max='50'
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className='w-full'
        />
      </div>
      <div className='flex items-center'>
        <div>
          {colorOptions.map((colorOption) => (
            <button 
              key={colorOption.hex} 
              onClick={() => handleColorClick(colorOption)}
              style={{ backgroundColor: colorOption.hex }}
              className='p-0 w-5 h-5 rounded' 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawingToolMenu;