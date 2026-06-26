import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Send, PhoneOff, AlertTriangle, Shield, Battery, Zap, Brain, Crosshair, Skull, Mic } from 'lucide-react';
import { BOSSES } from '../data/bosses';
import { motion, AnimatePresence } from 'motion/react';

const POWERUPS = [
  { id: 'coffee', name: 'Triple Espresso', desc: 'Restore 40 Willpower immediately.', icon: Battery, color: 'text-amber-500' },
  { id: 'thick_skin', name: 'Thick Skin', desc: 'Max Willpower increased by 20.', icon: Shield, color: 'text-blue-500' },
  { id: 'intel', name: 'Deep Zoom Info', desc: 'Start the next call with their exact pain points revealed.', icon: Crosshair, color: 'text-red-500' },
  { id: 'charm', name: 'Pattern Interrupt', desc: 'Next boss starts with 60 Sentiment instead of default.', icon: Zap, color: 'text-purple-500' },
  { id: 'script', name: 'Golden Script', desc: 'Once per run: Auto-deflect a massive objection (reduces Willpower drain to 0).', icon: Brain, color: 'text-emerald-500' },
];

export default function Gauntlet() {
  const navigate = useNavigate();

  // Run State
  const [wave, setWave] = useState(1);
  const [willpower, setWillpower] = useState(100);
  const [maxWillpower, setMaxWillpower] = useState(100);
  const [runFailed, setRunFailed] = useState(false);
  const [inPowerupScreen, setInPowerupScreen] = useState(false);
  const [activePowerups, setActivePowerups] = useState<string[]>([]);
  const [nextBossIntel, setNextBossIntel] = useState(false);

  // Encounter State
  const [bossIndex, setBossIndex] = useState(0);
  const bossList = Object.values(BOSSES);
  const currentBoss = bossList[bossIndex % bossList.length];
  const [messages, setMessages] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentiment, setSentiment] = useState({ score: 40, label: "Skeptical" });
  const [hasStarted, setHasStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInputValue(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const startWave = async () => {
    setHasStarted(true);
    setMessages([]);
    setSentiment({ score: activePowerups.includes('charm') ? 60 : 30, label: activePowerups.includes('charm') ? "Curious" : "Aggressive" });
    
    // Auto-message from Boss
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', parts: [{ text: "Hello?" }] }],
          systemPrompt: `You are ${currentBoss.name}. ${currentBoss.systemPrompt} The caller just initiated the call. Be extremely harsh. Output JSON format only as instructed before.`
        })
      });
      const data = await res.json();
      if (data.text) {
        setMessages([{ role: 'model', parts: [{ text: data.text }] }]);
        if (data.sentiment !== undefined) {
           setSentiment({ score: data.sentiment, label: data.sentimentLabel });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: 'user', parts: [{ text: inputValue }] }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          systemPrompt: `You are ${currentBoss.name}. ${currentBoss.systemPrompt} Respond to the seller.`
        })
      });
      const data = await res.json();
      
      if (data.text) {
        setMessages([...newMessages, { role: 'model', parts: [{ text: data.text }] }]);
        if (data.sentiment !== undefined) {
          setSentiment({ score: data.sentiment, label: data.sentimentLabel || "Unknown" });
          
          let wpDrain = 0;
          if (data.sentiment < 20) wpDrain = 20;
          else if (data.sentiment < 40) wpDrain = 10;
          else if (data.sentiment < 50) wpDrain = 5;
          else if (data.sentiment > 80) wpDrain = -10; // heal

          if (wpDrain > 0) {
              setWillpower(prev => Math.max(0, prev - wpDrain));
              if (willpower - wpDrain <= 0) {
                  setRunFailed(true);
              }
          } else if (wpDrain < 0) {
              setWillpower(prev => Math.min(maxWillpower, prev - wpDrain));
          }

          // Check Win Condition
          if (data.sentiment >= 85) {
              setTimeout(() => {
                  setInPowerupScreen(true);
              }, 1500);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const applyPowerup = (powerupId: string) => {
      setActivePowerups(prev => [...prev, powerupId]);
      if (powerupId === 'coffee') {
          setWillpower(prev => Math.min(maxWillpower, prev + 40));
      } else if (powerupId === 'thick_skin') {
          setMaxWillpower(prev => prev + 20);
          setWillpower(prev => prev + 20);
      } else if (powerupId === 'intel') {
          setNextBossIntel(true);
      }
      
      // Advance to next wave
      setWave(prev => prev + 1);
      setBossIndex(prev => prev + 1);
      setInPowerupScreen(false);
      setHasStarted(false);
      setMessages([]);
      if (powerupId !== 'intel') {
          setNextBossIntel(false);
      }
  };

  // UI Renders
  if (runFailed) {
      return (
          <div className="flex-1 bg-black flex flex-col items-center justify-center p-6 text-white font-pixel text-center">
              <Skull className="w-24 h-24 text-red-600 mb-6 mx-auto animate-pulse" />
              <h1 className="text-3xl md:text-5xl text-red-600 text-shadow-pixel uppercase mb-4">PIPELINE DRIED UP</h1>
              <p className="text-[12px] text-gray-400 mb-8 leading-loose uppercase">YOU LOST ALL WILLPOWER ON WAVE {wave}. THE BOSS HUNG UP.</p>
              <Link to="/" className="px-8 py-4 ff-panel bg-red-900 border-2 border-red-500 text-white uppercase transition-colors hover:brightness-125 shadow-md">
                  RETURN TO MAP
              </Link>
          </div>
      );
  }

  if (inPowerupScreen) {
      // Pick 3 random powerups
      const options = [...POWERUPS].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      return (
          <div className="flex-1 bg-black flex flex-col p-6 font-pixel text-white h-full relative overflow-y-auto">
             
             <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 z-10 py-10">
                 <div className="flex flex-col items-center mb-12 text-center ff-panel p-8 shadow-md border-[#3b82f6]/50">
                     <span className="text-[10px] text-[#3b82f6] text-shadow-pixel uppercase mb-4 block border-b-2 border-white/20 pb-2 animate-pulse w-full">WAVE {wave} CLEARED</span>
                     <h2 className="text-3xl md:text-5xl text-white text-shadow-pixel uppercase mb-6">PITCH LANDED.</h2>
                     <p className="text-[10px] text-gray-300 leading-loose max-w-xl ff-inset bg-black/50 p-6 shadow-inner">
                        THE PROSPECT CLOSED. TAKE A BREATH AND CHOOSE A RELIC BEFORE DIALING THE NEXT NUMBER.
                     </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {options.map((p, i) => (
                        <motion.button 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => applyPowerup(p.id)}
                            className="ff-panel p-8 flex flex-col items-center text-center transition-all hover:brightness-110 shadow-lg cursor-pointer border-[#a855f7]/30 hover:border-[#a855f7]"
                        >
                            <div className="w-16 h-16 ff-inset bg-black flex items-center justify-center mb-6 border-2 border-[#a855f7]/50 shadow-inner">
                                <p.icon className={`w-8 h-8 ${p.color}`} />
                            </div>
                            <h3 className="text-[12px] text-white text-shadow-pixel uppercase mb-4 underline decoration-[#a855f7]/50 leading-loose">{p.name}</h3>
                            <p className="text-[8px] text-gray-400 leading-loose">{p.desc}</p>
                        </motion.button>
                    ))}
                 </div>
                 
                 <div className="mt-auto flex justify-center">
                    <div className="flex items-center gap-6 ff-inset p-4 bg-white/5 border-2 border-white/20 shadow-md">
                        <span className="text-[10px] uppercase text-gray-400">CURRENT WILLPOWER</span>
                        <span className={`text-xl text-shadow-pixel ${willpower < 30 ? 'text-red-500' : 'text-[#facc15]'}`}>{willpower} / {maxWillpower}</span>
                    </div>
                 </div>
             </div>
          </div>
      );
  }

  return (
    <div className="flex-1 bg-black relative flex flex-col lg:flex-row p-2 gap-4 overflow-hidden h-full font-pixel">
      
      {/* Left column: HUD & Info */}
      <div className="w-full lg:w-80 ff-panel p-4 flex flex-col shrink-0 overflow-y-auto shadow-md">
         {/* Top HUD Stats (Moved to Left Col for FF theme) */}
         <div className="border-b-2 border-white/20 pb-4 mb-4">
             <div className="flex justify-between items-center mb-4">
               <div className="ff-panel-gold px-3 py-1 flex items-center gap-2 shadow-sm text-center">
                 <span className="text-[8px] text-white text-shadow-pixel uppercase">WAVE {wave}</span>
               </div>
               <button onClick={() => navigate('/')} className="text-[8px] uppercase text-gray-500 hover:text-red-500 transition-colors">
                   FLEE EXAM
               </button>
             </div>
             
             <div className="mb-2 flex justify-between items-end">
                <span className="text-[8px] uppercase text-gray-400">HP (WILLPOWER)</span>
                <span className={`text-[12px] text-shadow-pixel ${willpower < 30 ? 'text-red-500 animate-pulse' : 'text-[#facc15]'}`}>{willpower}/{maxWillpower}</span>
             </div>
             <div className="w-full h-3 bg-black ff-inset relative border-2 border-white/20 mb-4 shadow-inner">
                 <div className={`h-full transition-all duration-300 ${willpower < 30 ? 'bg-red-500' : 'bg-[#facc15]'}`} style={{ width: `${(willpower/maxWillpower)*100}%` }}></div>
             </div>
         </div>

         {/* Boss Info */}
         <div className="mb-6 relative z-10">
           <h3 className="text-lg text-[#3b82f6] text-shadow-pixel uppercase mb-2">TARGET:</h3>
           <h4 className="text-xl text-white text-shadow-pixel uppercase mb-4 border-b-2 border-white/20 pb-2">{currentBoss.name}</h4>
           <div className="ff-inset p-4 bg-white/5 border-2 border-white/10 shadow-inner">
             <p className="text-[8px] text-gray-300 leading-loose">
                {currentBoss.description}
             </p>
           </div>
         </div>

         <div className="mb-6">
           <div className="flex justify-between items-end mb-2">
             <span className="text-[8px] uppercase text-gray-400">LIMIT (SENTIMENT)</span>
             <span className={`text-[10px] text-shadow-pixel uppercase ${sentiment.score >= 70 ? 'text-[#10b981]' : sentiment.score >= 40 ? 'text-[#facc15]' : 'text-red-500'}`}>{sentiment.label} ({sentiment.score})</span>
           </div>
           <div className="h-3 w-full bg-black ff-inset border-2 border-white/20 relative shadow-inner">
             <div className={`h-full transition-all duration-500 ${sentiment.score >= 70 ? 'bg-[#10b981]' : sentiment.score >= 40 ? 'bg-[#facc15]' : 'bg-red-500'}`} style={{ width: `${sentiment.score}%` }}></div>
           </div>
         </div>

         {nextBossIntel && (
           <div className="mb-6 ff-panel-red border-red-500 p-4 shadow-md bg-red-900/10">
               <h4 className="text-[8px] text-red-500 text-shadow-pixel uppercase mb-3 flex items-center gap-2 border-b-2 border-red-500/30 pb-2"><Crosshair className="w-4 h-4"/> RAW INTEL</h4>
               <p className="text-[8px] text-red-200 leading-loose">{currentBoss.description}</p>
           </div>
         )}
         
         <div className="mt-auto">
             <h4 className="text-[10px] text-white text-shadow-pixel uppercase mb-3 border-b-2 border-white/20 pb-2">ACTIVE RELICS</h4>
             {activePowerups.length === 0 ? (
                 <span className="text-[8px] text-gray-500 uppercase">NO RELICS.</span>
             ) : (
                 <div className="flex flex-wrap gap-2">
                   {activePowerups.map((p, i) => (
                      <div key={i} className="text-[8px] ff-inset bg-white/5 border-2 border-white/20 text-[#a855f7] px-3 py-2 uppercase shadow-sm">{p}</div>
                   ))}
                 </div>
             )}
         </div>
      </div>

      {/* Battle/Chat Area */}
      <div className="flex-1 flex flex-col relative ff-inset bg-[#111] overflow-hidden shadow-inner">
        {!hasStarted ? (
          <div className="flex-1 flex items-center justify-center p-6">
             <button 
              onClick={startWave}
              className="ff-panel hover:brightness-125 text-white text-[12px] uppercase px-8 py-6 transition-colors flex items-center gap-3 shadow-lg"
             >
               <PhoneOff className="w-5 h-5" /> INITIATE COMBAT
             </button>
          </div>
        ) : (
          <>
            {/* Chat Log */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] md:max-w-[70%] p-6 ${
                    m.role === 'user' 
                      ? 'ff-panel bg-[#1e3a8a]/20 border-[#3b82f6] text-white ml-auto shadow-md' 
                      : 'ff-panel bg-black border-red-900/50 text-gray-200 shadow-md'
                  }`}>
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-white/10 pb-2">
                      <span className={`text-[10px] text-shadow-pixel uppercase ${m.role === 'user' ? 'text-[#3b82f6]' : 'text-red-400'}`}>
                        {m.role === 'user' ? 'HERO (YOU)' : currentBoss.name}
                      </span>
                    </div>
                    <div className="text-[10px] leading-loose whitespace-pre-wrap">
                      {m.parts[0].text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start w-full">
                   <div className="ff-panel bg-black border-gray-600 p-4 flex items-center gap-3 shadow-sm">
                     <span className="text-[10px] text-gray-400 uppercase tracking-widest animate-pulse">ENEMY THINKING...</span>
                   </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 ff-panel bg-black border-t-2 border-white/20 shrink-0">
              <div className="relative">
                {sentiment.score >= 85 && (
                  <div className="absolute -top-16 left-0 right-0 ff-panel border-[#10b981] bg-[#10b981]/20 text-[#10b981] text-[12px] p-4 text-center uppercase flex items-center justify-center gap-3 shadow-lg z-10 text-shadow-pixel">
                     <Zap className="w-5 h-5" /> BATTLE WON.
                  </div>
                )}
                <textarea 
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                      }
                  }}
                  placeholder={sentiment.score >= 85 ? "OPPONENT DEFEATED." : "PREPARE YOUR ACTION..."}
                  className="w-full ff-inset bg-black p-4 pr-32 text-[10px] text-white focus:outline-none focus:border-[#3b82f6] focus:bg-white/5 transition-colors resize-none h-24 disabled:opacity-50 shadow-inner leading-loose"
                  disabled={isLoading || sentiment.score >= 85}
                />
                
                <div className="absolute right-4 bottom-4 flex gap-2">
                  <button 
                    onClick={toggleListening}
                    title={isListening ? "Stop Listening" : "Start Voice Input"}
                    disabled={isLoading || sentiment.score >= 85}
                    className={`ff-panel p-3 text-white hover:brightness-125 disabled:opacity-50 transition-colors shadow-sm ${isListening ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-[#111] border-white/20'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading || sentiment.score >= 85}
                    className="ff-panel p-3 text-white hover:brightness-125 disabled:opacity-50 transition-colors shadow-sm bg-[#111] border-white/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-[8px] text-gray-500 uppercase">
                <span>ENTER TO CAST // SHIFT+ENTER FOR NEW LINE</span>
                {willpower < 30 && <span className="text-red-500 animate-pulse text-shadow-pixel">DANGER: LOW HP</span>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
