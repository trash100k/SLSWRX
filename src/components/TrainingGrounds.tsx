import React, { useState } from 'react';
import { Mail, CheckCircle, AlertTriangle, Zap, Target, BrainCircuit, Library, Swords, Flame, ChevronRight, BookOpen, Quote, ShieldAlert, Check, X, Activity } from 'lucide-react';

const PLAYBOOKS = [
  { id: 1, title: 'The Pattern Interrupt', category: 'Hook', time: '1 min read', content: "Instead of 'How are you?', use 'I know I am an interruption, do you have 27 seconds?'. It breaks the prospect's autopilot rejection loop and grants you permission to pitch.", icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 2, title: 'Upfront Contract', category: 'Sandler', time: '2 min read', content: 'Set the agenda immediately. "By the end of this call, we either agree to X, or we part ways. Fair?" Eliminates "think it over" wishy-washy behavior.', icon: Target, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
  { id: 3, title: 'Negative Reverse', category: 'Objections', time: '1 min read', content: "When they say \"We use Competitor X\", reply \"Makes sense. X is a great tool. I guess there's no reason to see how we do Y differently then?\" Push them away to pull them in.", icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { id: 4, title: 'Labeling', category: 'Negotiation', time: '1.5 min read', content: '"It sounds like you are hesitating on the implementation time." Use labeling to defuse negative emotions without agreeing or disagreeing.', icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 5, title: 'The Permission Pitch', category: 'Hook', time: '1 min read', content: "\"If I can take 30 seconds to explain what we do, you can hang up if it's not relevant. Deal?\" Gives them control while guaranteeing you a window.", icon: ShieldAlert, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' }
];

const DRILLS = [
  { 
    id: 1, 
    scenario: "Prospect: 'We have no budget right now.'", 
    type: "Objection Handling", 
    options: [
      { text: "Okay, call back in Q3?", isCorrect: false, explanation: "You just lost all control. Don't fold on the first push." },
      { text: "Most of our clients didn't have budget when we first spoke. How are you currently handling [Pain]?", isCorrect: true, explanation: "Perfect. Acknowledge, normalize, and pivot back to pain finding." }
    ]
  },
  {
    id: 2,
    scenario: "Prospect: 'Just send me an email.'",
    type: "Brush-Off",
    options: [
      { text: "Sure, what's your best email?", isCorrect: false, explanation: "They will delete your email. It's a polite brush-off." },
      { text: "I can do that. But usually when people say that, they're just being polite. Is that the case here?", isCorrect: true, explanation: "Calls out the brush-off professionally (The Negative Reverse)." }
    ]
  },
  {
    id: 3,
    scenario: "Gatekeeper: 'Is he expecting your call?'",
    type: "Gatekeeper Block",
    options: [
      { text: "No, but I just...", isCorrect: false, explanation: "Never lie, but saying 'No' gives them permission to block you." },
      { text: "He's not. Could you help me out? I'm trying to figure out who handles X.", isCorrect: true, explanation: "Ask for help. Gatekeepers are people; they often assist when asked." }
    ]
  }
];

export default function TrainingGrounds() {
  const [activeTab, setActiveTab] = useState<'playbook' | 'dojo' | 'roaster'>('playbook');
  
  // Playbook State
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // Dojo State
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [drillFeedback, setDrillFeedback] = useState<{ isCorrect: boolean, text: string } | null>(null);

  // Roaster State
  const [coldEmailText, setColdEmailText] = useState('');
  const [isRoasting, setIsRoasting] = useState(false);
  const [roastResult, setRoastResult] = useState<any>(null);

  const handleRoastEmail = async () => {
    if (!coldEmailText.trim() || isRoasting) return;
    setIsRoasting(true);
    try {
        const res = await fetch('/api/roast-email', {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ emailText: coldEmailText })
        });
        const data = await res.json();
        const parsed = JSON.parse(data.result.replace(/```json/g, '').replace(/```/g, '').trim());
        setRoastResult(parsed);
    } catch(e) {
        console.error(e);
    } finally {
        setIsRoasting(false);
    }
  };

  const handleDrillAnswer = (isCorrect: boolean, explanation: string) => {
    setDrillFeedback({ isCorrect, text: explanation });
  };

  const nextDrill = () => {
    setDrillFeedback(null);
    setCurrentDrillIndex((prev) => (prev + 1) % DRILLS.length);
  };

  return (
    <div className="flex-1 bg-black p-2 flex flex-col lg:flex-row gap-4 text-white font-pixel h-full overflow-hidden leading-relaxed">
      
      {/* Sidebar Navigation */}
      <div className="lg:w-64 ff-panel p-4 flex flex-col shrink-0 shadow-md">
         <div className="border-b-2 border-white/20 pb-4 mb-4 relative overflow-hidden text-center">
           <span className="text-[8px] text-[#facc15] text-shadow-pixel uppercase mb-2 block relative z-10 w-full border-b-2 border-[#facc15]/30 pb-2">MODULE SELECTION</span>
           <h1 className="text-xl md:text-2xl text-white text-shadow-pixel uppercase mt-4 relative z-10">TRAINING<br/>GROUNDS</h1>
         </div>
         
         <div className="flex-1 space-y-3">
            <button 
              onClick={() => setActiveTab('playbook')} 
              className={`w-full text-left px-4 py-4 ff-panel border-2 transition-colors flex items-center justify-between ${activeTab === 'playbook' ? 'border-[#facc15] text-[#facc15] bg-white/10' : 'border-gray-600 text-gray-400 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Library className="w-4 h-4 shrink-0" />
                <span className="text-[10px] uppercase">GRIMOIRE</span>
              </div>
              {activeTab === 'playbook' && <ChevronRight className="w-5 h-5 shrink-0" />}
            </button>

            <button 
              onClick={() => setActiveTab('dojo')} 
              className={`w-full text-left px-4 py-4 ff-panel border-2 transition-colors flex items-center justify-between ${activeTab === 'dojo' ? 'border-red-500 text-red-500 bg-red-900/20' : 'border-gray-600 text-gray-400 hover:text-red-400'}`}
            >
              <div className="flex items-center gap-3">
                <Swords className="w-4 h-4 shrink-0" />
                <span className="text-[10px] uppercase">DOJO BATTLES</span>
              </div>
              {activeTab === 'dojo' && <ChevronRight className="w-5 h-5 shrink-0 text-red-500" />}
            </button>

            <button 
              onClick={() => setActiveTab('roaster')} 
              className={`w-full text-left px-4 py-4 ff-panel border-2 transition-colors flex items-center justify-between ${activeTab === 'roaster' ? 'border-[#3b82f6] text-[#3b82f6] bg-blue-900/20' : 'border-gray-600 text-gray-400 hover:text-[#3b82f6]'}`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="text-[10px] uppercase">MISSIVE FORGE</span>
              </div>
              {activeTab === 'roaster' && <ChevronRight className="w-5 h-5 shrink-0 text-[#3b82f6]" />}
            </button>

            <button 
              onClick={() => setActiveTab('transcript')} 
              className={`w-full text-left px-4 py-4 ff-panel border-2 transition-colors flex items-center justify-between ${activeTab === 'transcript' ? 'border-[#a855f7] text-[#c084fc] bg-purple-900/20' : 'border-gray-600 text-gray-400 hover:text-[#c084fc]'}`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 shrink-0" />
                <span className="text-[10px] uppercase mt-1">SCRYING ORB</span>
              </div>
              {activeTab === 'transcript' && <ChevronRight className="w-5 h-5 shrink-0 text-[#a855f7]" />}
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#111] ff-inset p-4 lg:p-8 overflow-y-auto">
         
         {/* THE PLAYBOOK */}
         {activeTab === 'playbook' && (
           <div className="max-w-5xl mx-auto">
              <div className="mb-8 ff-panel p-6 shadow-md border-[#facc15]/30 flex flex-col items-center sm:items-start">
                 <h2 className="text-2xl text-white text-shadow-pixel mb-4 uppercase flex items-center gap-4 border-b-2 border-white/20 pb-2 w-full"><Library className="w-8 h-8 text-[#facc15]" /> THE GRIMOIRE</h2>
                 <p className="text-[10px] text-gray-300">BITE-SIZED, HIGH-LEVERAGE SPELLS AND INCANTATIONS.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {PLAYBOOKS.map((pb) => (
                   <div 
                     key={pb.id} 
                     onClick={() => setSelectedCard(selectedCard === pb.id ? null : pb.id)}
                     className={`ff-panel p-6 cursor-pointer hover:brightness-110 transition-all ${selectedCard === pb.id ? 'border-[#facc15] shadow-[0_0_20px_rgba(250,204,21,0.2)]' : 'border-gray-600'}`}
                   >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 ff-inset ${pb.bg} border-2 ${pb.border}`}>
                           <pb.icon className={`w-6 h-6 ${pb.color}`} />
                        </div>
                        <span className="text-[8px] text-gray-400 uppercase bg-black/50 px-2 py-1">{pb.time}</span>
                      </div>
                      
                      <div className="mb-6">
                        <span className={`text-[8px] uppercase px-2 py-1 ff-inset inline-block mb-4 ${pb.color} ${pb.border}`}>{pb.category}</span>
                        <h3 className="text-[12px] text-white text-shadow-pixel uppercase underline decoration-white/20 leading-loose">{pb.title}</h3>
                      </div>

                      {selectedCard === pb.id ? (
                        <div className="text-[10px] text-gray-300 leading-loose border-t-2 border-white/20 pt-4 mt-2 ff-inset p-4 bg-white/5">
                           <Quote className="w-4 h-4 text-gray-500 mb-2" />
                           {pb.content}
                        </div>
                      ) : (
                        <p className="text-[8px] text-gray-500 uppercase flex items-center gap-2 mt-4 hover:text-[#facc15] transition-colors"><ChevronRight className="w-3 h-3" /> CLICK TO EXPAND</p>
                      )}
                   </div>
                 ))}
              </div>
           </div>
         )}


         {/* THE DOJO */}
         {activeTab === 'dojo' && (
           <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-center mb-10 w-full relative ff-panel p-8 md:p-12 border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
                 <span className="text-[10px] text-[#facc15] text-shadow-pixel uppercase block mb-4 border-b-2 border-white/20 pb-2 mx-auto w-fit">ENCOUNTER {currentDrillIndex + 1}/{DRILLS.length}</span>
                 <span className="inline-block px-4 py-2 ff-inset text-[10px] text-red-400 uppercase mt-2 mb-8 bg-black/50">
                   {DRILLS[currentDrillIndex].type}
                 </span>
                 <h2 className="text-xl md:text-2xl text-white text-shadow-pixel uppercase border-l-4 border-red-500 pl-6 text-left leading-loose px-4">
                   "{DRILLS[currentDrillIndex].scenario}"
                 </h2>
              </div>

              {!drillFeedback ? (
                <div className="w-full space-y-4">
                  {DRILLS[currentDrillIndex].options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => handleDrillAnswer(opt.isCorrect, opt.explanation)}
                      className="w-full text-left p-6 ff-panel hover:brightness-125 transition-colors group flex items-start sm:items-center gap-6 shadow-md cursor-pointer"
                    >
                      <div className="w-10 h-10 shrink-0 ff-inset flex items-center justify-center text-[12px] text-[#facc15] text-shadow-pixel group-hover:bg-[#facc15]/20 transition-colors">
                         {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-[10px] text-white text-shadow-pixel leading-loose">{opt.text}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`w-full p-8 ff-panel flex flex-col items-center text-center shadow-lg ${drillFeedback.isCorrect ? 'border-[#10b981] bg-green-900/10' : 'ff-panel-red border-red-500'}`}>
                   {drillFeedback.isCorrect ? (
                     <CheckCircle className="w-20 h-20 text-[#10b981] mb-6 drop-shadow-md" />
                   ) : (
                     <X className="w-20 h-20 text-red-500 mb-6 drop-shadow-md" />
                   )}
                   <h3 className={`text-2xl text-shadow-pixel uppercase mb-6 ${drillFeedback.isCorrect ? 'text-[#10b981]' : 'text-red-500'}`}>
                     {drillFeedback.isCorrect ? 'CRITICAL HIT!' : 'ATTACK MISSED!'}
                   </h3>
                   <p className="text-[10px] text-white leading-loose mb-10 max-w-xl ff-inset p-6 bg-black/50">{drillFeedback.text}</p>
                   
                   <button 
                     onClick={nextDrill}
                     className="px-8 py-4 ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-white text-white text-[10px] uppercase hover:brightness-125 transition-colors flex items-center gap-3 shadow-md"
                   >
                     NEXT FOE <ChevronRight className="w-5 h-5" />
                   </button>
                </div>
              )}
           </div>
         )}


         {/* THE ROASTER (Email) */}
         {activeTab === 'roaster' && (
           <div className="max-w-4xl mx-auto space-y-6">
             <div className="ff-panel p-8 relative overflow-hidden text-center shadow-md">
                 <span className="text-[8px] text-[#3b82f6] text-shadow-pixel uppercase mb-4 block border-b-2 border-white/20 pb-2">MISSIVE FORGERY //</span>
                 <h1 className="text-3xl text-white text-shadow-pixel uppercase mb-4">THE ROASTER</h1>
                 <p className="text-[10px] text-gray-300">BURN YOUR OUTREACH BEFORE IT BURNS YOUR BRIDGES.</p>
             </div>

             <div className="ff-panel p-8 shadow-md">
                <h2 className="text-[10px] text-[#3b82f6] text-shadow-pixel mb-6 uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2">
                  <Mail className="w-5 h-5 text-[#3b82f6]" /> PAYLOAD SCROLL
                </h2>
                <textarea 
                  value={coldEmailText}
                  onChange={e => setColdEmailText(e.target.value)}
                  disabled={isRoasting}
                  placeholder="Inscribe your missive here..."
                  className="w-full ff-inset p-6 text-[10px] text-white focus:outline-none focus:border-[#3b82f6] focus:bg-white/10 transition-colors mb-6 min-h-[200px] resize-y"
                />
                <button 
                 onClick={handleRoastEmail}
                 disabled={isRoasting || !coldEmailText.trim()}
                 className="w-full py-4 ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-[#3b82f6] text-[#3b82f6] text-[10px] hover:brightness-125 uppercase transition-colors flex justify-center items-center gap-3 disabled:opacity-50 shadow-md text-shadow-pixel"
                >
                 {isRoasting ? <><span className="w-4 h-4 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></span> CASTING IDENTIFY...</> : "ROAST MISSIVE"}
                </button>
             </div>

             {roastResult && (
               <div className="p-8 ff-panel border-[#3b82f6] shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-blue-900/10">
                 <div className="flex flex-col md:flex-row gap-8">
                     <div className="flex-1 md:border-r-2 border-[#3b82f6]/30 md:pr-8">
                         <div className="flex flex-col items-center md:items-start mb-8 border-b-2 border-white/20 pb-6">
                           <span className="text-[8px] text-[#3b82f6] text-shadow-pixel uppercase mb-2">POWER LEVEL</span>
                           <span className="text-5xl text-shadow-pixel text-[#3b82f6]">{roastResult.score}<span className="text-xl text-gray-400">/100</span></span>
                         </div>
                         <div className="mb-8">
                             <span className="text-[10px] text-[#facc15] text-shadow-pixel uppercase block mb-4 border-b-2 border-white/20 pb-2">THE SAGE's VERDICT:</span>
                             <p className="text-[10px] text-white leading-loose ff-inset p-6 bg-red-900/20 border-red-500/50">"{roastResult.roast}"</p>
                         </div>
                         <div>
                             <span className="text-[10px] text-[#facc15] text-shadow-pixel uppercase block mb-4 border-b-2 border-white/20 pb-2">CRITICAL FLAWS:</span>
                             <ul className="space-y-4">
                                 {roastResult.improvements.map((imp: string, i: number) => (
                                     <li key={i} className="flex gap-4 text-[10px] text-gray-300 leading-loose">
                                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-1" />
                                        <span>{imp}</span>
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     </div>
                     <div className="flex-1 flex flex-col pt-8 md:pt-0">
                         <span className="text-[10px] text-[#10b981] text-shadow-pixel uppercase flex gap-3 items-center mb-6 border-b-2 border-white/20 pb-2">
                             <CheckCircle className="w-5 h-5" /> REFORGED MISSIVE
                         </span>
                         <div className="text-[10px] text-white leading-loose ff-inset p-6 bg-black/60 flex-1">
                           <div className="whitespace-pre-wrap block">{roastResult.rewrite}</div>
                         </div>
                     </div>
                 </div>
               </div>
             )}
           </div>
         )}
         
         {/* SCRYING ORB (Transcript) */}
         {activeTab === 'transcript' && (
           <div className="max-w-4xl mx-auto space-y-6">
             <div className="ff-panel p-8 relative overflow-hidden text-center shadow-md">
                 <span className="text-[8px] text-[#a855f7] text-shadow-pixel uppercase mb-4 block border-b-2 border-white/20 pb-2">DIVINATION MAGICK //</span>
                 <h1 className="text-3xl text-white text-shadow-pixel uppercase mb-4">SCRYING ORB</h1>
                 <p className="text-[10px] text-gray-300">OFFER A TRANSCRIPT OF PAST BATTLES FOR ANALYSIS.</p>
             </div>

             <div className="ff-panel p-12 text-center border-dashed border-[#a855f7]/50 hover:border-[#a855f7] hover:bg-[#a855f7]/5 transition-colors cursor-pointer group shadow-lg">
                 <Activity className="w-16 h-16 text-[#a855f7] mb-8 mx-auto drop-shadow-md group-hover:scale-110 transition-transform" />
                 <h3 className="text-xl text-white text-shadow-pixel uppercase mb-4">MUSTER TRANSCRIPT (.TXT)</h3>
                 <p className="text-[8px] text-gray-400 uppercase tracking-widest bg-black/50 px-4 py-2 inline-block rounded-none border border-white/10">CLICK TO BROWSE INVENTORY</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
                <div className="ff-panel p-6 flex items-center gap-6 shadow-sm">
                  <div className="w-14 h-14 ff-inset bg-black flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-[#a855f7]" />
                  </div>
                  <div>
                     <span className="block text-[8px] text-gray-400 uppercase mb-2">TARGET METRIC</span>
                     <span className="text-[12px] text-white text-shadow-pixel uppercase">TALK/LISTEN RATIO</span>
                  </div>
                </div>
                <div className="ff-panel p-6 flex items-center gap-6 shadow-sm">
                  <div className="w-14 h-14 ff-inset bg-black flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 text-[#a855f7]" />
                  </div>
                  <div>
                     <span className="block text-[8px] text-gray-400 uppercase mb-2">TARGET METRIC</span>
                     <span className="text-[12px] text-white text-shadow-pixel uppercase">OBJECTION DEFENSE</span>
                  </div>
                </div>
             </div>
           </div>
         )}

      </div>
    </div>
  );
}
