import React, { useState, useEffect, useRef } from 'react';
import { Mic, Zap, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Negotiation() {
  const [round, setRound] = useState(1);
  const [status, setStatus] = useState<'idle' | 'listening' | 'evaluating' | 'done'>('idle');
  const [transcript, setTranscript] = useState('');
  const [dealValue, setDealValue] = useState(100000);
  const [opponentText, setOpponentText] = useState("We love the product, but $100k is just too much. We can do $75k, otherwise we walk.");
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
      // Logic for negotiation simulation
      if (round === 1) {
          setOpponentText("Okay, you want to stick to $100k but add more seats? Fine, but I need net-90 payment terms.");
          setDealValue(90000); // Simulate lost value due to terms
          setFeedback(f => [...f, "Round 1: Held price, but conceded payment terms. (-$10k ACV equivalent)."]);
          setRound(2);
          setStatus('idle');
      } else if (round === 2) {
          setOpponentText("You drive a hard bargain. We will sign today at $90k with Net-45.");
          setDealValue(90000);
          setFeedback(f => [...f, "Round 2: Good trade. Met in the middle."]);
          setRound(3);
          setStatus('idle');
      } else {
          setFeedback(f => [...f, "Round 3: Deal Closed."]);
          setStatus('done');
      }
    }, 2000);
  };

  return (
    <div className="flex-1 bg-black p-4 flex justify-center text-white font-pixel h-full overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col gap-6">
        
        <div className="ff-panel p-6 flex justify-between items-center border-b border-[#222]">
          <div className="flex items-center gap-4">
             <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
             <h1 className="text-xl uppercase">THE REDLINE (NEGOTIATION)</h1>
          </div>
          <div className="flex gap-4 items-center bg-[#0a0a0a] p-3 border border-[#222]">
            <span className="text-[10px] text-gray-500">DEAL VALUE</span>
            <span className={`text-xl ${dealValue === 100000 ? 'text-green-500' : 'text-yellow-500'}`}>
                ${dealValue.toLocaleString()}
            </span>
          </div>
        </div>

        {status === 'done' ? (
          <div className="ff-panel p-8 text-center flex flex-col items-center">
            <h2 className="text-2xl text-green-500 mb-6 uppercase flex items-center gap-4">
                <CheckCircle className="w-8 h-8" /> CLOSED WON
            </h2>
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
                  ROUND {round} / 3: PROCUREMENT
               </div>

               <h2 className="text-lg md:text-xl text-center text-red-400 uppercase leading-loose mb-12 max-w-2xl">
                 "{opponentText}"
               </h2>

               <div className="w-full max-w-2xl bg-[#0a0a0a] border border-[#222] min-h-[100px] p-4 text-[10px] text-gray-300 leading-loose">
                  {transcript || (status === 'listening' ? <span className="animate-pulse text-gray-600">LISTENING...</span> : <span className="text-gray-600">STATE YOUR COUNTER OFFER...</span>)}
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
                   <Mic className="w-5 h-5" /> RELEASE TO COUNTER
                 </button>
               )}
               {status === 'evaluating' && (
                 <button 
                   disabled
                   className="px-8 py-6 bg-[#111] border border-[#333] text-gray-500 text-[12px] uppercase flex items-center gap-3"
                 >
                   PROCUREMENT IS THINKING...
                 </button>
               )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
