import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, Timer, Skull, Zap, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Guillotine() {
  const [level, setLevel] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(100); // percentage 100 to 0
  const [status, setStatus] = useState<'idle' | 'calling' | 'active' | 'hungUp' | 'success'>('idle');
  const [micActive, setMicActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  // The higher the level, the faster the time drains
  const drainRate = 0.5 + (level * 0.4); 

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const t = event.results[event.results.length - 1][0].transcript;
        if (t.length > 5) {
            simulateSuccess();
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'active' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const next = prev - drainRate;
          if (next <= 0) {
            setStatus('hungUp');
            setMicActive(false);
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch(e){}
            }
            return 0;
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [status, timeRemaining, drainRate]);

  const handleStart = () => {
    setStatus('calling');
    setTimeout(() => {
      setStatus('active');
      setTimeRemaining(100);
      setMicActive(true);
      if (recognitionRef.current) {
          try { recognitionRef.current.start(); } catch(e){}
      }
    }, 1500);
  };

  const simulateSuccess = () => {
    if (status !== 'active') return;
    setStatus('success');
    setMicActive(false);
    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
    }
    setTimeout(() => {
      setLevel(l => l + 1);
      setStatus('idle');
    }, 2000);
  };

  const handleMicClick = () => {
    // We let them click to skip if they don't have a mic
    if (status === 'active') {
      simulateSuccess();
    }
  };

  return (
    <div className="flex-1 bg-black min-h-full flex flex-col items-center justify-center relative p-4 overflow-hidden font-pixel">
      {/* Background intensity based on level */}
      <div className={`absolute inset-0 bg-red-900 transition-opacity duration-1000 ${status === 'hungUp' ? 'opacity-20' : 'opacity-0'}`}></div>
      <div className={`absolute inset-0 bg-blue-900 transition-opacity duration-1000 ${status === 'success' ? 'opacity-20' : 'opacity-0'}`}></div>
      
      <div className="absolute top-8 left-8 flex flex-col gap-4 z-10">
         <div className="text-[10px] text-gray-300 tracking-widest uppercase flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#facc15]" /> MODE: THE GUILLOTINE
         </div>
         <div className="flex items-center gap-4">
           <span className="text-xl md:text-3xl text-white text-shadow-pixel uppercase">STAGE {level}</span>
           {level > 5 && <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />}
         </div>
         <p className="text-[8px] text-gray-400">TOLERANCE WINDOW: {Math.max(0.5, (5 - level * 0.5)).toFixed(1)}s</p>
      </div>

      <div className="absolute top-8 right-8 z-10">
         <button onClick={() => navigate('/arcade')} className="text-[8px] uppercase text-gray-400 hover:text-white transition-colors border-2 border-gray-800 px-4 py-2 hover:border-white/20">
           ESCAPE THE BLOCK
         </button>
      </div>

      {status === 'idle' && (
        <div className="flex flex-col items-center z-10 max-w-lg text-center animate-in fade-in zoom-in duration-500 ff-panel p-8">
           <Skull className="w-12 h-12 text-red-500 mb-6 drop-shadow-md" />
           <h1 className="text-2xl md:text-4xl text-white text-shadow-pixel uppercase mb-6">THE GUILLOTINE</h1>
           <p className="text-[10px] text-gray-300 leading-loose mb-8 ff-inset p-4">
             PITCH PERFECTLY OR GET THE DIAL TONE. TIME TOLERANCE DECREASES EVERY STAGE. BY STAGE 10, BREATHING WRONG RESULTS IN A DEAD CALL.
           </p>
           <button 
             onClick={handleStart}
             className="bg-red-600 hover:bg-red-500 text-white px-12 py-4 text-[12px] text-shadow-pixel uppercase transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-105 border-2 border-red-400"
           >
             ENTER BATTLE
           </button>
        </div>
      )}

      {status === 'calling' && (
        <div className="flex flex-col items-center z-10 animate-pulse ff-panel p-8">
           <PhoneOff className="w-12 h-12 text-gray-300 mb-6" />
           <p className="text-[12px] text-white text-shadow-pixel uppercase">DIALING...</p>
        </div>
      )}

      {status === 'active' && (
        <div className="flex flex-col items-center w-full max-w-2xl z-10 ff-panel p-8 opacity-100 transition-opacity">
           <div className="w-full h-8 ff-inset mb-12 relative overflow-hidden">
             <div 
               className={`absolute top-0 left-0 bottom-0 transition-all ${timeRemaining < 30 ? 'bg-red-500' : 'bg-blue-500'} bg-opacity-80`}
               style={{ width: `${timeRemaining}%` }}
             ></div>
           </div>
           
           <div className="text-center mb-12">
             <p className="text-[12px] md:text-lg text-white text-shadow-pixel uppercase mb-4">"HELLO? MAKE IT QUICK."</p>
             <p className="text-[8px] text-gray-300 uppercase">PROSPECT PICKED UP. CAST YOUR PITCH.</p>
           </div>

           <button 
             onMouseDown={handleMicClick}
             className={`w-32 h-32 rounded border-4 flex items-center justify-center transition-all ${micActive ? 'border-[#3b82f6] bg-[#3b82f6]/20 text-[#3b82f6] shadow-lg scale-105' : 'border-[#334155] bg-black text-gray-400'} `}
           >
             <Mic className="w-12 h-12" />
           </button>
           <p className="text-[8px] text-gray-400 mt-8 uppercase">TAP TO DELIVER MAGIC</p>
        </div>
      )}

      {status === 'hungUp' && (
        <div className="flex flex-col items-center z-10 animate-in slide-in-from-bottom flex-1 justify-center">
           <div className="ff-panel-red p-8 flex flex-col items-center">
             <AlertTriangle className="w-12 h-12 text-white mb-6 animate-pulse" />
             <h2 className="text-2xl text-white text-shadow-pixel uppercase mb-4">*CLICK*</h2>
             <p className="text-[10px] text-red-200 uppercase mb-8 ff-inset p-4">PROSPECT EVADED.</p>
             <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button 
                  onClick={() => { setLevel(1); setStatus('idle'); }}
                  className="bg-black border-2 border-gray-600 text-gray-400 px-6 py-4 uppercase text-[10px] hover:bg-white/10 transition-colors flex-1"
                >
                  FLEE
                </button>
                <button 
                  onClick={handleStart}
                  className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 uppercase text-[10px] transition-colors border-2 border-red-400 shadow-md flex-1 text-shadow-pixel"
                >
                  DIAL AGAIN
                </button>
             </div>
           </div>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center z-10 animate-in zoom-in ff-panel p-8">
           <Zap className="w-16 h-16 text-[#facc15] mb-6 drop-shadow-md" />
           <h2 className="text-2xl text-white text-shadow-pixel uppercase mb-4">CRITICAL HIT!</h2>
           <p className="text-[10px] text-[#facc15] uppercase ff-inset p-4 text-shadow-pixel border-[#facc15]">
             TOLERANCE TIGHTENING...
           </p>
        </div>
      )}

    </div>
  );
}
