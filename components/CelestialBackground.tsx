
import React from 'react';
import { TimeOfDay } from '../types';

interface CelestialBackgroundProps {
  time: TimeOfDay;
}

const CelestialBackground: React.FC<CelestialBackgroundProps> = ({ time }) => {
  const getStyles = () => {
    switch (time) {
      case TimeOfDay.MORNING:
        return {
          gradient: 'from-blue-300 via-sky-400 to-amber-100',
          sunPos: { left: '15%', top: '65%' },
          moonPos: { left: '50%', top: '120%' },
          sunOpacity: 1,
          moonOpacity: 0,
          sunScale: 1,
          showStars: false,
          sunGlow: 'shadow-[0_0_100px_rgba(252,211,77,0.8)] bg-amber-200'
        };
      case TimeOfDay.LUNCH:
        return {
          gradient: 'from-sky-400 via-blue-400 to-sky-200',
          sunPos: { left: '35%', top: '25%' },
          moonPos: { left: '50%', top: '120%' },
          sunOpacity: 1,
          moonOpacity: 0,
          sunScale: 1.3,
          showStars: false,
          sunGlow: 'shadow-[0_0_150px_rgba(251,191,36,0.9)] bg-yellow-300'
        };
      case TimeOfDay.EVENING:
        // Adjusted to be high-right to follow the arc from Lunch
        return {
          gradient: 'from-orange-600 via-rose-500 to-indigo-900',
          sunPos: { left: '65%', top: '25%' },
          moonPos: { left: '50%', top: '120%' },
          sunOpacity: 1,
          moonOpacity: 0,
          sunScale: 1.1,
          showStars: false,
          sunGlow: 'shadow-[0_0_120px_rgba(251,146,60,0.8)] bg-orange-300'
        };
      case TimeOfDay.NIGHT:
        // Adjusted to be low-right as if setting or moon rising further along
        return {
          gradient: 'from-slate-900 via-indigo-950 to-black',
          sunPos: { left: '50%', top: '120%' },
          moonPos: { left: '85%', top: '65%' },
          sunOpacity: 0,
          moonOpacity: 1,
          sunScale: 0.8,
          showStars: true,
          sunGlow: ''
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`fixed inset-0 transition-all duration-[1500ms] ease-in-out bg-gradient-to-b ${styles.gradient} z-0`}>
      {/* Stars Layer */}
      <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${styles.showStars ? 'opacity-100' : 'opacity-0'}`}>
         {[...Array(60)].map((_, i) => (
           <div 
             key={i} 
             className="absolute rounded-full bg-white animate-pulse"
             style={{
               width: Math.random() * 2 + 1 + 'px',
               height: Math.random() * 2 + 1 + 'px',
               top: Math.random() * 100 + '%',
               left: Math.random() * 100 + '%',
               animationDelay: Math.random() * 5 + 's',
               opacity: Math.random() * 0.7 + 0.3
             }}
           />
         ))}
      </div>

      {/* Sun - Moves along the arc */}
      <div 
        className={`absolute w-32 h-32 rounded-full transition-all duration-[1500ms] ease-in-out transform -translate-x-1/2 -translate-y-1/2 ${styles.sunGlow}`}
        style={{ 
          left: styles.sunPos.left, 
          top: styles.sunPos.top, 
          opacity: styles.sunOpacity,
          scale: styles.sunScale
        }}
      />

      {/* Moon - Specific night positioning */}
      <div 
        className="absolute w-28 h-28 rounded-full transition-all duration-[1500ms] ease-in-out transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 shadow-[0_0_60px_rgba(241,245,249,0.5)] flex items-center justify-center overflow-hidden"
        style={{ 
          left: styles.moonPos.left, 
          top: styles.moonPos.top, 
          opacity: styles.moonOpacity 
        }}
      >
        <div className="absolute w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-4 left-6 w-4 h-4 rounded-full bg-slate-900" />
          <div className="absolute top-12 left-14 w-6 h-6 rounded-full bg-slate-900" />
          <div className="absolute bottom-6 left-8 w-3 h-3 rounded-full bg-slate-900" />
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />

      <style>{`
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default CelestialBackground;
