import React, { useState, useEffect, useRef } from 'react';
import { Mic, Zap, Heart, Crosshair, PhoneOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OBJECTIONS = [
  "We don't have budget for this until Q4.",
  "We are already using your competitor.",
  "Send me an email and I'll get back to you.",
  "We built this internally, so we don't need it.",
  "This sounds exactly like what our current CRM does."
];

export default function RapidFire() {
  const [currObjection, setCurrObjection] = useState(0);
  const [status, setStatus] = useState<'idle' | 'listening' | 'evaluating' | 'done'>('idle');
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          }
        }
        if (final) {
          setTranscript(prev => prev + (prev ? ' ' : '') + final);
          // Auto evaluate after some length or in a real app via silence detection
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
    };
  }, []);

  const startListening = () => {
    if (status === 'done') return;
    setStatus('listening');
    setTranscript('');
    try { recognitionRef.current?.start(); } catch(e) {}
  };

  const stopListeningAndEval = () => {
    setStatus('evaluating');
    try { recognitionRef.current?.stop(); } catch(e) {}
    
    setTimeout(() => {
      let points = Math.floor(Math.random() * 20) + 80;
      setScore(s => s + points);
      setFeedback(f => [...f, `Objection ${currObjection + 1}: ${points} PTS - Good pivot.`]);
      
      if (currObjection < OBJECTIONS.length - 1) {
        setCurrObjection(c => c + 1);
        setStatus('idle');
      } else {
        setStatus('done');
      }
    }, 1500);
  };

  return (
    <div className="flex-1 bg-black p-4 flex justify-center text-white font-pixel h-full overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col gap-6">
        
        <div className="ff-panel p-6 flex justify-between items-center border-b border-[#222]">
          <div className="flex items-center gap-4">
             <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
             <h1 className="text-xl uppercase">RAPID FIRE OBJECTIONS</h1>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-[10px] text-gray-500">SCORE</span>
            <span className="text-xl text-yellow-500">{score}</span>
          </div>
        </div>

        {status === 'done' ? (
          <div className="ff-panel p-8 text-center flex flex-col items-center">
            <h2 className="text-2xl text-white mb-6 uppercase">GAUNTLET COMPLETE</h2>
            <div className="text-[10px] text-gray-400 mb-8 space-y-4 max-w-lg mx-auto text-left">
              {feedback.map((f, i) => (
                <div key={i} className="bg-[#111] p-4 border border-[#333]">{f}</div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/arcade')}
              className="px-8 py-4 bg-white text-black text-[10px] hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold"
            >
              RETURN TO ARCADE
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-6">
            <div className="ff-panel flex-1 flex flex-col items-center justify-center p-8 relative min-h-[300px]">
               <div className="absolute top-4 left-4 text-[10px] text-gray-500">
                  OBJECTION {currObjection + 1} / {OBJECTIONS.length}
               </div>

               <h2 className="text-xl md:text-2xl text-center text-red-400 uppercase leading-loose mb-12">
                 "{OBJECTIONS[currObjection]}"
               </h2>

               <div className="w-full max-w-2xl bg-[#0a0a0a] border border-[#222] min-h-[100px] p-4 text-[10px] text-gray-300 leading-loose">
                  {transcript || (status === 'listening' ? <span className="animate-pulse text-gray-600">LISTENING...</span> : <span className="text-gray-600">AWAITING INPUT...</span>)}
               </div>
            </div>

            <div className="flex gap-4 justify-center">
               {status === 'idle' && (
                 <button 
                   onClick={startListening}
                   className="px-8 py-6 bg-red-900 border border-red-500 text-white text-[12px] hover:bg-red-800 transition-colors uppercase flex items-center gap-3"
                 >
                   <Mic className="w-5 h-5" /> HOLD TO SPEAK
                 </button>
               )}
               {status === 'listening' && (
                 <button 
                   onClick={stopListeningAndEval}
                   className="px-8 py-6 bg-red-600 border border-red-400 text-white text-[12px] hover:bg-red-500 transition-colors uppercase flex items-center gap-3 animate-pulse"
                 >
                   <Mic className="w-5 h-5" /> RELEASE TO SEND
                 </button>
               )}
               {status === 'evaluating' && (
                 <button 
                   disabled
                   className="px-8 py-6 bg-[#111] border border-[#333] text-gray-500 text-[12px] uppercase flex items-center gap-3"
                 >
                   EVALUATING...
                 </button>
               )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
