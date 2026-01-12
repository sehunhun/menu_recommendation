
import React, { useState } from 'react';
import { TimeOfDay, Category, Recommendation } from './types';
import CelestialBackground from './components/CelestialBackground';
import Wheel from './components/Wheel';
import { getMealRecommendation } from './geminiService';
// Removed KoreanControl as it's not a valid export from lucide-react
import { Clock, Sun, Sunset, Moon, Loader2, Sparkles, ChevronRight, Utensils, Coins } from 'lucide-react';

const App: React.FC = () => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(TimeOfDay.MORNING);
  const [category, setCategory] = useState<Category>(Category.KOREAN);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [activePanel, setActivePanel] = useState<'time' | 'category' | 'price'>('time');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinEnd = async (color: string) => {
    setIsLoading(true);
    const result = await getMealRecommendation(timeOfDay, category, minPrice, maxPrice, color);
    setRecommendation(result);
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-center overflow-hidden">
      <CelestialBackground time={timeOfDay} />

      {/* Side Control Panel (Left) */}
      <div className="z-20 md:absolute md:left-8 flex flex-col gap-4 w-full md:w-64 px-6 md:px-0 py-4 md:py-0">
        
        {/* Section: Time */}
        <div className="group">
          <button 
            onClick={() => setActivePanel('time')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl backdrop-blur-md border border-white/20 transition-all ${activePanel === 'time' ? 'bg-white/20 shadow-lg ring-2 ring-white/50' : 'bg-white/5'}`}
          >
            <div className="flex items-center gap-3 font-bold text-white uppercase tracking-wider text-sm">
              <Clock size={18} />
              시간대
            </div>
            <ChevronRight size={18} className={`text-white transition-transform ${activePanel === 'time' ? 'rotate-90' : ''}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${activePanel === 'time' ? 'max-h-60 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-2 gap-2">
              <SelectionItem active={timeOfDay === TimeOfDay.MORNING} onClick={() => setTimeOfDay(TimeOfDay.MORNING)} label="아침" icon={<Sun size={14}/>} />
              <SelectionItem active={timeOfDay === TimeOfDay.LUNCH} onClick={() => setTimeOfDay(TimeOfDay.LUNCH)} label="점심" icon={<Clock size={14}/>} />
              <SelectionItem active={timeOfDay === TimeOfDay.EVENING} onClick={() => setTimeOfDay(TimeOfDay.EVENING)} label="저녁" icon={<Sunset size={14}/>} />
              <SelectionItem active={timeOfDay === TimeOfDay.NIGHT} onClick={() => setTimeOfDay(TimeOfDay.NIGHT)} label="야식" icon={<Moon size={14}/>} />
            </div>
          </div>
        </div>

        {/* Section: Category (Flags) */}
        <div className="group">
          <button 
            onClick={() => setActivePanel('category')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl backdrop-blur-md border border-white/20 transition-all ${activePanel === 'category' ? 'bg-white/20 shadow-lg ring-2 ring-white/50' : 'bg-white/5'}`}
          >
            <div className="flex items-center gap-3 font-bold text-white uppercase tracking-wider text-sm">
              <Utensils size={18} />
              카테고리
            </div>
            <ChevronRight size={18} className={`text-white transition-transform ${activePanel === 'category' ? 'rotate-90' : ''}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${activePanel === 'category' ? 'max-h-60 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-2 gap-2">
              <SelectionItem active={category === Category.KOREAN} onClick={() => setCategory(Category.KOREAN)} label="한식" icon={<span className="text-lg">🇰🇷</span>} />
              <SelectionItem active={category === Category.CHINESE} onClick={() => setCategory(Category.CHINESE)} label="중식" icon={<span className="text-lg">🇨🇳</span>} />
              <SelectionItem active={category === Category.JAPANESE} onClick={() => setCategory(Category.JAPANESE)} label="일식" icon={<span className="text-lg">🇯🇵</span>} />
              <SelectionItem active={category === Category.WESTERN} onClick={() => setCategory(Category.WESTERN)} label="양식" icon={<span className="text-lg">🇺🇸</span>} />
              <SelectionItem active={category === Category.MEXICAN} onClick={() => setCategory(Category.MEXICAN)} label="멕시코" icon={<span className="text-lg">🇲🇽</span>} />
            </div>
          </div>
        </div>

        {/* Section: Price */}
        <div className="group">
          <button 
            onClick={() => setActivePanel('price')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl backdrop-blur-md border border-white/20 transition-all ${activePanel === 'price' ? 'bg-white/20 shadow-lg ring-2 ring-white/50' : 'bg-white/5'}`}
          >
            <div className="flex items-center gap-3 font-bold text-white uppercase tracking-wider text-sm">
              <Coins size={18} />
              가격대
            </div>
            <ChevronRight size={18} className={`text-white transition-transform ${activePanel === 'price' ? 'rotate-90' : ''}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${activePanel === 'price' ? 'max-h-60 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-2 p-3 bg-white/10 rounded-xl">
              <input 
                type="number" 
                placeholder="최소 금액" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-1 ring-white/40 placeholder-white/30"
              />
              <input 
                type="number" 
                placeholder="최대 금액" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-1 ring-white/40 placeholder-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Wheel Area */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 p-4">
        <Wheel 
          onSpinEnd={handleSpinEnd} 
          isSpinning={isSpinning} 
          setIsSpinning={setIsSpinning} 
        />

        {/* Result Display */}
        <div className="min-h-[160px] w-full max-w-md mt-12 flex flex-col items-center justify-center text-center">
          {isLoading ? (
            <div className="flex flex-col items-center text-white space-y-3 bg-black/40 backdrop-blur-lg px-8 py-6 rounded-3xl animate-pulse border border-white/10 shadow-2xl">
              <Loader2 className="animate-spin text-amber-400" size={32} />
              <p className="font-bold tracking-widest text-sm">두근두근 오늘 뭐먹지?!</p>
            </div>
          ) : recommendation ? (
            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border-b-8 border-rose-500/30 transform transition-all animate-[popIn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)]">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles size={16} className="text-rose-500 animate-pulse" />
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">Celestial Result</span>
                <Sparkles size={16} className="text-rose-500 animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">{recommendation.dish}</h2>
              <div className="h-0.5 w-10 bg-rose-200 mx-auto mb-4" />
              <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                "{recommendation.reason}"
              </p>
            </div>
          ) : (
            <div className="bg-black/30 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 shadow-xl">
              <p className="text-white/80 font-semibold tracking-tight text-sm">왼쪽 옵션을 선택하고 돌림판을 돌려보세요!</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

interface SelectionItemProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const SelectionItem: React.FC<SelectionItemProps> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
      active 
        ? 'bg-white text-slate-900 shadow-md scale-105 ring-1 ring-white/50' 
        : 'bg-white/10 text-white hover:bg-white/20'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
