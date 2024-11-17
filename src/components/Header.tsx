import React from 'react';
import { FaPaintBrush, FaEraser } from 'react-icons/fa';
import { GiClick } from 'react-icons/gi';
import { VscDebugRestart } from 'react-icons/vsc';
import { BrushStyle } from '../interfaces/brushStyle'; 
import { Color } from '../interfaces/color'; 

interface HeaderProps {
  tool: string;
  brushStyle: BrushStyle;
  colors: Color[];
  handleChangeTool: (tool: "brush" | "eraser") => void;
  setTool: React.Dispatch<React.SetStateAction<"brush" | "eraser" | "click">>;
  clearCanvas: () => void;
}

const Header: React.FC<HeaderProps> = ({
  tool,
  brushStyle,
  colors,
  handleChangeTool,
  setTool,
  clearCanvas,
}) => {
  return (
    <div className="flex bg-purple-700 h-[5%] w-full pl-[1.5%] items-center justify-center">
      <button
        onClick={() => handleChangeTool('brush')}
        style={{
          backgroundColor: tool === 'brush' ? '#F8FAFC' : 'transparent',
        }}
        className="p-0 h-7 w-7 flex justify-center items-center rounded-full"
      >
        <FaPaintBrush
          style={{ fill: tool === 'brush' ? brushStyle.color.hex : 'white' }}
          className="size-[60%]"
        />
      </button>
      <button
        onClick={() => handleChangeTool('eraser')}
        style={{
          backgroundColor: tool === 'eraser' ? '#F8FAFC' : 'transparent',
        }}
        className="p-0 h-7 w-7 flex justify-center items-center rounded-full ml-[0.3%]"
      >
        <FaEraser
          style={{
            fill: tool === 'eraser' ? colors.find(option => option.name === 'purple')?.hex : 'white',
          }}
          className="size-[75%]"
        />
      </button>
      <button
        onClick={() => setTool('click')}
        style={{
          backgroundColor: tool === 'click' ? '#F8FAFC' : 'transparent',
        }}
        className="p-0 h-7 w-7 flex justify-center items-center rounded-full ml-[0.5%]"
      >
        <GiClick
          style={{
            fill: tool === 'click' ? colors.find(option => option.name === 'purple')?.hex : 'white',
          }}
          className="size-[75%]"
        />
      </button>
      <button
        onClick={clearCanvas}
        className="p-0 flex justify-center items-center bg-transparent ml-[0.3%] h-full"
      >
        <VscDebugRestart className="fill-white size-[78%]" />
      </button>
    </div>
  );
};

export default Header;