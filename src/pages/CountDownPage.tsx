import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CountdownPage: React.FC = () => {
  const [count, setCount] = useState(5); 
  const [opacity, setOpacity] = useState(1); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (count > 0) {
      const interval = setInterval(() => {
        setOpacity(0); 
        setTimeout(() => {
          setCount((prev) => prev - 1); 
          setOpacity(1); 
        }, 500); 
      }, 1000);

      return () => clearInterval(interval);
    }  else {
        navigate('/collaborative-drawing'); 
    };
  }, [count, navigate]);

  return (
    <div className='flex justify-center h-screen w-screen bg-white'>
      <div
        className="text-[10rem] font-bold mt-[8%]"
        style={{
          color: '#6B21A8', 
          opacity: opacity,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        {count}
      </div>
    </div>
  );
};

export default CountdownPage;