
import React, { useState, useRef, useEffect } from 'react';

interface WheelProps {
  onSpinEnd: (color: string) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
];

const Wheel: React.FC<WheelProps> = ({ onSpinEnd, isSpinning, setIsSpinning }) => {
  const [rotation, setRotation] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(4000);
  // Fix: Use any to avoid "Cannot find namespace 'NodeJS'" error in browser environments.
  const timeoutRef = useRef<any>(null);
  const currentRotationRef = useRef(0);

  const finishSpin = (finalRotation: number) => {
    setIsSpinning(false);
    const normalizedRotation = finalRotation % 360;
    const index = Math.floor(((360 - normalizedRotation) % 360) / 45);
    onSpinEnd(COLORS[index]);
  };

  const spin = () => {
    if (isSpinning) {
      // Skip logic: click again while spinning
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTransitionDuration(0);
      const finalRot = currentRotationRef.current;
      setRotation(finalRot);
      finishSpin(finalRot);
      return;
    }
    
    setIsSpinning(true);
    setTransitionDuration(4000);
    const extraDegrees = Math.floor(Math.random() * 360) + 1440; 
    const newRotation = rotation + extraDegrees;
    currentRotationRef.current = newRotation;
    setRotation(newRotation);

    timeoutRef.current = setTimeout(() => {
      finishSpin(newRotation);
    }, 4000);
  };

  return (
    <div className="relative group">
      {/* Indicator */}
      <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-20 w-8 h-12 bg-red-600 clip-path-triangle filter drop-shadow-lg" 
           style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }} />
      
      {/* The Wheel */}
      <svg 
        viewBox="0 0 400 400" 
        className="w-80 h-80 md:w-[450px] md:h-[450px] drop-shadow-2xl"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: transitionDuration > 0 ? `transform ${transitionDuration}ms cubic-bezier(0.15, 0, 0.15, 1)` : 'none'
        }}
      >
        <circle cx="200" cy="200" r="195" fill="#222" stroke="#fff" strokeWidth="8" />
        {COLORS.map((color, i) => {
          const startAngle = (i * 360) / COLORS.length;
          const endAngle = ((i + 1) * 360) / COLORS.length;
          
          const x1 = 200 + 190 * Math.cos((Math.PI * (startAngle - 90)) / 180);
          const y1 = 200 + 190 * Math.sin((Math.PI * (startAngle - 90)) / 180);
          const x2 = 200 + 190 * Math.cos((Math.PI * (endAngle - 90)) / 180);
          const y2 = 200 + 190 * Math.sin((Math.PI * (endAngle - 90)) / 180);

          return (
            <path
              key={i}
              d={`M 200 200 L ${x1} ${y1} A 190 190 0 0 1 ${x2} ${y2} Z`}
              fill={color}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          );
        })}
        <circle cx="200" cy="200" r="40" fill="#fff" className="shadow-inner" />
        <circle cx="200" cy="200" r="30" fill="#333" />
      </svg>

      {/* Center Spin Button */}
      <button 
        onClick={spin}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full flex items-center justify-center font-bold text-[10px] uppercase tracking-widest text-white transition-all transform hover:scale-110 active:scale-95 shadow-lg ${
          isSpinning ? 'bg-amber-500 animate-pulse' : 'bg-rose-600'
        }`}
      >
        {isSpinning ? 'SKIP' : 'SPIN'}
      </button>
    </div>
  );
};

export default Wheel;
