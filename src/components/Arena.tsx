import { useState, useRef, useEffect } from 'react';
import { Send, PhoneOff, Mic, Radar, Activity } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BOSSES } from '../data/bosses';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function Arena() {
  const [searchParams] = useSearchParams();
  const bossId = searchParams.get('boss') || 'greg';
  
  let boss = BOSSES[bossId];
  if (bossId === 'custom') {
    const stored = localStorage.getItem('custom_boss');
    if (stored) boss = JSON.parse(stored);
  }
  if (!boss) boss = BOSSES['greg'];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [intel, setIntel] = useState<string | null>(null);
  const [isGettingIntel, setIsGettingIntel] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sentiment, setSentiment] = useState({ score: 40, label: "Skeptical" });
  const [callTime, setCallTime] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

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
          setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
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

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasStarted) {
       interval = setInterval(() => {
          setCallTime(prev => prev + 1);
       }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Start with a generic model message if we just reloaded
    if (!hasStarted && messages.length === 0) {
      setHasStarted(true);
      if (boss.id === 'greg') {
        setMessages([{ role: 'model', parts: [{ text: "Yeah this is Greg. I'm literally in the middle of fifteen things. Make it quick, who is this?" }] }]);
      } else if (boss.id === 'patty') {
        setMessages([{ role: 'model', parts: [{ text: "Procurement, Patty speaking. I'm looking at your pricing sheet right now and the numbers aren't making sense. Go ahead." }] }]);
      } else if (boss.id === 'custom') {
        setMessages([{ role: 'model', parts: [{ text: `Yes, this is ${boss.name.split(' ')[0]}. I only have two minutes.` }] }]);
      } else {
        setMessages([{ role: 'model', parts: [{ text: "Dave here. Make it fast." }] }]);
      }
    }
  }, [boss, hasStarted, messages.length]);

  const handleGetIntel = async () => {
    if (messages.length < 2 || isGettingIntel) return;
    setIsGettingIntel(true);
    setIntel(null);
    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            transcript: messages, 
            bossContext: boss.systemPrompt 
        })
      });
      const data = await res.json();
      setIntel(data.text);
    } catch(e) {
      console.error(e);
    } finally {
      setIsGettingIntel(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    setIntel(null);
    const userMsg: Message = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: boss.systemPrompt,
          messages: newMessages
        })
      });
      
      const data = await res.json();
      if (data.text) {
        setMessages([...newMessages, { role: 'model', parts: [{ text: data.text }] }]);
        if (data.sentiment !== undefined) {
          setSentiment({ score: data.sentiment, label: data.sentimentLabel || "Unknown" });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHangUp = () => {
    // Navigate to post-game analysis and pass transcript via state
    navigate('/post-call', { state: { transcript: messages, bossId: boss.id } });
  };

  return (
    <div className="flex-1 bg-black relative flex flex-col font-pixel overflow-hidden h-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.03)_0%,_transparent_70%)] pointer-events-none"></div>

      <div className="h-20 ff-panel border-b-2 border-white/20 flex items-center justify-between px-6 shrink-0 relative z-10 flex-wrap gap-4 shadow-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-red-900 border-2 border-red-500 text-white text-[8px] sm:text-[10px] text-shadow-pixel uppercase">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span> LIVE ARENA
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-300 uppercase flex items-center gap-2">
               TARGET: <span className="text-[#facc15] font-bold text-shadow-pixel">{boss.name}</span>
               <span className="text-[#3b82f6] ml-2 animate-pulse flex items-center gap-1"><Activity className="w-3 h-3"/> {formatTime(callTime)}</span>
             </span>
          </div>
        </div>

        <div className="flex-1 max-w-[250px] hidden md:flex flex-col mx-4">
           <div className="flex justify-between items-end mb-2">
             <span className="text-[8px] text-gray-400 uppercase">HP (SENTIMENT)</span>
             <span className={`text-[10px] uppercase text-shadow-pixel ${sentiment.score >= 70 ? 'text-[#10b981]' : sentiment.score >= 40 ? 'text-[#facc15]' : 'text-red-500'}`}>{sentiment.label} ({sentiment.score})</span>
           </div>
           <div className="h-2 w-full ff-inset relative">
             <div className={`h-full transition-all duration-500 ${sentiment.score >= 70 ? 'bg-[#10b981] shadow-inner' : sentiment.score >= 40 ? 'bg-[#facc15] shadow-inner' : 'bg-red-500 shadow-inner'}`} style={{ width: `${sentiment.score}%` }}></div>
           </div>
        </div>

        <button 
          onClick={handleHangUp}
          className="flex items-center gap-2 px-6 py-4 ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-red-500 text-white text-[10px] hover:bg-red-600 hover:brightness-125 uppercase transition-colors shadow-md"
        >
          <PhoneOff className="w-4 h-4" /> FLEE BOUNDARY
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 relative z-10 leading-loose" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <span className={`text-[10px] mb-2 uppercase text-shadow-pixel ${msg.role === 'user' ? 'text-[#facc15]' : 'text-red-400'}`}>
               {msg.role === 'user' ? 'YOUR PARTY' : `${boss.name.split(' ')[0]} (ENEMY)`}
            </span>
            <div className={`max-w-[90%] sm:max-w-[70%] p-6 ${
              msg.role === 'user' 
                ? 'ff-panel border-2 border-[#facc15]/50 hover:border-[#facc15] text-white' 
                : 'ff-panel border-2 border-red-500/50 hover:border-red-500 text-white'
            }`}>
              <p className="text-[10px] leading-relaxed break-words">{msg.parts[0].text}</p>
            </div>
          </div>
        ))}
        {intel && (
          <div className="flex flex-col items-center my-6 opacity-90 animate-pulse">
            <span className="bg-[#facc15] text-black text-[10px] px-4 py-2 uppercase border-2 border-white shadow-md">SCAN RESULTS</span>
            <div className="ff-panel-gold border-[#facc15] p-6 mt-2 text-center text-white text-[10px] max-w-[80%] leading-loose">
              "{intel}"
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] mb-2 uppercase text-red-500 text-shadow-pixel">
               {boss.name.split(' ')[0]} (ENEMY)
            </span>
            <div className="ff-panel border-red-500/50 p-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-bounce border border-white"></span>
              <span className="w-2 h-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-bounce delay-100 border border-white"></span>
              <span className="w-2 h-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-bounce delay-200 border border-white"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 ff-panel border-t-2 border-white/20 relative z-10 shrink-0 shadow-lg">
        <div className="flex gap-4">
          <button 
            onClick={handleGetIntel}
            disabled={messages.length < 2 || isGettingIntel || isLoading}
            title="Scan Enemy"
            className="w-16 h-16 flex items-center justify-center ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-[#facc15] text-[#facc15] hover:brightness-125 transition-colors shrink-0 disabled:opacity-30 shadow-md"
          >
            {isGettingIntel ? <span className="w-6 h-6 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin"></span> : <Radar className="w-6 h-6" />}
          </button>
          
          <button 
            onClick={toggleListening}
            title={isListening ? "Stop Listening" : "Start Voice Input"}
            className={`w-16 h-16 flex items-center justify-center ff-panel border-2 text-white hover:brightness-125 transition-colors shrink-0 shadow-md ${isListening ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-gradient-to-b from-gray-800 to-gray-900 border-gray-400'}`}
          >
            <Mic className="w-6 h-6" />
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="CAST YOUR SPEECH..."
            className="flex-1 ff-inset p-4 text-[10px] text-white focus:outline-none focus:border-[#facc15] focus:bg-white/10 placeholder-gray-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-8 ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-[#facc15] text-[#facc15] text-[10px] uppercase hover:brightness-125 transition-colors disabled:opacity-50 shrink-0 hidden sm:block shadow-md text-shadow-pixel"
          >
            ATTACK
          </button>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-[#facc15] text-[#facc15] hover:brightness-125 transition-colors disabled:opacity-50 shrink-0 sm:hidden flex items-center justify-center shadow-md"
          >
             <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
