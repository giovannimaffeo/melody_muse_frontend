import React, { useEffect, useState } from 'react';

interface TimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  onComplete?: () => void; 
};

const Timer: React.FC<TimerProps> = ({ hours, minutes, seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(
    hours * 3600 + minutes * 60 + seconds
  );

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); 
    } else if (onComplete) {
      onComplete(); 
    }
  }, [timeLeft, onComplete]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s]
      .map((unit) => String(unit).padStart(2, '0')) 
      .join(':');
  };

  return (
    <div className='flex justify-center items-center font-bold bg-purple-700 text-white h-[3vh]'>
      <span
        className='text-[5vw] sm:text-[1.2rem]' 
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default Timer;
