import React from 'react';

import { Color } from '../interfaces/color';
import { colors } from '../constants/colors';
import { BrushStyle } from '../interfaces/brushStyle';

interface DrawingToolMenuProps {
  brushStyle: BrushStyle;
  setBrushStyle: React.Dispatch<React.SetStateAction<BrushStyle>>;
};

const DrawingToolMenu: React.FC<DrawingToolMenuProps> = ({ 
  brushStyle, 
  setBrushStyle
}) => {
  const handleColorClick = (colorOption: Color) => {
    setBrushStyle({ ...brushStyle, color: colorOption }); 
    
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
          value={brushStyle.size}
          onChange={(e) => setBrushStyle({ ...brushStyle, size: Number(e.target.value)})}
          className='w-full'
        />
      </div>
      <div className='flex items-center'>
        <div>
          {colors.map((colorOption) => (
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