import React from 'react';

import { Color } from '../interfaces/color';
import { colors } from '../constants/colors';
import { BrushStyle } from '../interfaces/brushStyle';
import { AiOutlineSound  } from "react-icons/ai";
import { FaRegCircleStop } from "react-icons/fa6";

interface DrawingToolMenuProps {
  brushStyle: BrushStyle;
  handleChangeBrushStyle: <K extends keyof BrushStyle>(key: K, value: BrushStyle[K]) => void;
  playingColors: Color[];
  setPlayingColors: React.Dispatch<React.SetStateAction<Color[]>>;
};

const DrawingToolMenu: React.FC<DrawingToolMenuProps> = ({ 
  brushStyle, 
  handleChangeBrushStyle,
  playingColors,
  setPlayingColors
}) => {
  const isPlayingColor = (colorOption: Color) => {
    return playingColors.some((playingColor) => playingColor.name === colorOption.name);
  };

  const handlePlayStopColor = (colorOption: Color) => {
    if (isPlayingColor(colorOption)) {
      colorOption.sound.pause();
      colorOption.sound.currentTime = 0; 
      setPlayingColors(playingColors.filter((playingColor) => playingColor.name !== colorOption.name));
    } else {
      if (colorOption.sound) {
        setPlayingColors([...playingColors, colorOption]);
        colorOption.sound.currentTime = 0; 
        colorOption.sound.play();

        colorOption.sound.onended = () => {
          setPlayingColors(playingColors.filter((playingColor) => playingColor.name !== colorOption.name));
        };
      };
    };
  };

  return (
    <div className='absolute top-[6%] left-[42%] bg-gray-700 text-white px-4 pt-4 pb-2 rounded-lg shadow-lg flex flex-col gap-2'>
      <div className='flex items-center'>
        <input
          type='range'
          min='1'
          max='50'
          value={brushStyle.size}
          onChange={(e) => handleChangeBrushStyle('size', Number(e.target.value))}
          className='w-full'
        />
      </div>
      <div className='flex items-center gap-1'>
        {colors.map((colorOption) => (
          <div className='flex flex-col' key={colorOption.hex}>
            <button 
              onClick={() => handleChangeBrushStyle('color', colorOption)}
              style={{ backgroundColor: colorOption.hex }}
              className='p-0 w-5 h-5 rounded' 
            />
            <button
              onClick={() => handlePlayStopColor(colorOption)}
              className='p-0 w-5 h-5 mt-1 rounded-full flex justify-center items-center shadow-md bg-transparent'
            >
              {isPlayingColor(colorOption) ? <FaRegCircleStop size={15} /> : <AiOutlineSound size={15} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawingToolMenu;