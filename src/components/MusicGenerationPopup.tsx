import React from "react";

interface MusicGenerationPopupProps {
  onClose: () => void; 
  onPlayInOrder: () => void;  
  onReorganizeAndPlay: () => void;  
};

const MusicGenerationPopup: React.FC<MusicGenerationPopupProps> = ({
  onClose,
  onPlayInOrder,
  onReorganizeAndPlay,
}) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-[90%] md:w-[400px] rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-center mb-4 text-black">
          Como você deseja gerar sua música?
        </h2>
        <div className="flex flex-col gap-4">
          <button
            className="w-full py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-200"
            onClick={() => {onClose(); onPlayInOrder();}}
          >
            Na ordem desenhada
          </button>
          <button
            className="w-full py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-200"
            onClick={() => {onClose(); onReorganizeAndPlay();}}
          >
            Reorganizar traços
          </button>
        </div>
        <button
          className="w-full mt-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition duration-200 bg-transparent"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default MusicGenerationPopup;
