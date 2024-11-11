import { ColorOption } from '../interfaces/colorOption';

interface DrawingToolMenuProps {
  colorOptions: ColorOption[];
  brushSize: number;
  setBrushSize: (size: number) => void;
  setColor: (color: ColorOption) => void;
}

const DrawingToolMenu = ({ 
  colorOptions, 
  brushSize, 
  setBrushSize, 
  setColor 
}: DrawingToolMenuProps) => {
  const handleColorClick = (colorOption: ColorOption) => {
    setColor(colorOption); 
    
    if (colorOption.sound) {
      colorOption.sound.currentTime = 0; 
      colorOption.sound.play();
    }
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
              key={colorOption.color}
              onClick={() => handleColorClick(colorOption)}
              className={`p-0 w-5 h-5 rounded bg-${colorOption.tailwind}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawingToolMenu;
