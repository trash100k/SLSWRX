import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Swords, TrendingUp, TrendingDown, Target, ArrowLeft } from 'lucide-react';
import { getStoredElo, getRankData } from '../lib/game';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'conference' | 'rivalry' | 'global'>('conference');
  const currentElo = getStoredElo();
  const rankData = getRankData(currentElo);

  // Construct a dynamic conference list based on user's current ELO
  const conference = [
    { name: 'Sarah_Closr', score: currentElo + 120, trend: 'up', status: 'promotion' },
    { name: 'Mike_Drops', score: currentElo + 80, trend: 'same', status: 'promotion' },
    { name: 'YOU', score: currentElo, trend: 'up', status: 'promotion' },
    { name: 'Demo_Diana', score: currentElo - 40, trend: 'down', status: 'safe' },
    { name: 'ColdCallKing', score: currentElo - 90, trend: 'up', status: 'safe' },
    { name: 'JustCheckingIn', score: currentElo - 150, trend: 'down', status: 'safe' },
    { name: 'Feature_Dumper', score: currentElo - 220, trend: 'down', status: 'safe' },
    { name: 'Discount_Dan', score: currentElo - 310, trend: 'down', status: 'relegation' },
    { name: 'Ghosted_Gary', score: currentElo - 400, trend: 'down', status: 'relegation' },
    { name: 'Please_Respond', score: currentElo - 450, trend: 'down', status: 'relegation' },
  ];

  return (
    <div className="flex-1 bg-black p-2 flex flex-col text-white font-pixel h-full overflow-hidden leading-relaxed">
      {/* Header */}
      <div className="ff-panel p-6 shrink-0 relative overflow-hidden shadow-md mb-4">
        
        <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-[8px] uppercase mb-6 transition-colors w-fit border-b border-transparent hover:border-white pb-1">
          <ArrowLeft className="w-3 h-3" /> RETURN TO MAP
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10 w-full">
           <div>
             <span className="text-[8px] text-[#facc15] text-shadow-pixel uppercase mb-2 block">LEAGUE GUILD //</span>
             <h1 className="text-2xl md:text-3xl text-white text-shadow-pixel uppercase mb-3 mt-4">CLASS III</h1>
             <p className="text-[8px] text-gray-300">GUILD 14 • CAMPAIGN ENDS IN 4D 12H</p>
           </div>
           
           <div className="flex gap-4 w-full md:w-auto flex-wrap md:flex-nowrap">
             <button onClick={() => setActiveTab('conference')} className={`flex-1 md:flex-none px-6 py-4 text-[10px] uppercase transition-colors whitespace-nowrap shadow-md ${activeTab === 'conference' ? 'ff-panel border-2 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'ff-panel border-2 border-gray-600 text-gray-400 hover:text-white'}`}>
               GUILD RANK
             </button>
             <button onClick={() => setActiveTab('rivalry')} className={`flex-1 md:flex-none px-6 py-4 text-[10px] uppercase transition-colors flex items-center justify-center gap-3 whitespace-nowrap shadow-md ${activeTab === 'rivalry' ? 'ff-panel-red border-2 border-white text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'ff-panel border-2 border-gray-600 text-gray-400 hover:text-white'}`}>
               <Swords className="w-4 h-4" /> DUEL
             </button>
             <button onClick={() => setActiveTab('global')} className={`flex-1 md:flex-none px-6 py-4 text-[10px] uppercase transition-colors whitespace-nowrap shadow-md ${activeTab === 'global' ? 'ff-panel border-2 border-[#a855f7] bg-purple-900/30 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'ff-panel border-2 border-gray-600 text-gray-400 hover:text-white'}`}>
               GRANDMASTERS
             </button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-2 shrink-0 w-full">
         <div className="max-w-5xl mx-auto w-full">
           
           {activeTab === 'conference' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b-2 border-white/20 pb-4 px-2">
                  <h2 className="text-[14px] text-white text-shadow-pixel uppercase">GUILD STANDINGS</h2>
                  <span className="text-[8px] text-gray-300">TOP 3 ADVANCE • BOTTOM 3 DOWNGRADE</span>
                </div>

                <div className="space-y-2">
                  {conference.map((p, i) => (
                    <div key={i} className="relative group">
                      {p.status === 'promotion' && i === 0 && <div className="text-[8px] text-[#10b981] text-shadow-pixel uppercase mb-2 mt-4 pl-4 border-l-4 border-[#10b981]">PROMOTION TIER</div>}
                      {p.status === 'safe' && i === 3 && <div className="text-[8px] text-gray-400 text-shadow-pixel uppercase mb-2 mt-6 pl-4 border-l-4 border-gray-500">SAFE TIER</div>}
                      {p.status === 'relegation' && i === 7 && <div className="text-[8px] text-red-500 text-shadow-pixel uppercase mb-2 mt-6 pl-4 border-l-4 border-red-500">DEMOTION TIER</div>}
                      
                      <div className={`flex items-center p-4 ff-panel shadow-sm hover:brightness-110 transition-all ${
                          p.name === 'YOU' ? 'border-[#facc15] bg-[#facc15]/10' : 
                          p.status === 'promotion' ? 'border-[#10b981]/50' : 
                          p.status === 'relegation' ? 'border-red-500/50' : ''
                        }`}>
                         <div className="w-12 text-center text-[10px] text-gray-400 ff-inset py-2 bg-white/5">{i + 1}</div>
                         <div className="flex-1 px-6">
                           <div className="flex items-center gap-4">
                             <span className={`text-[12px] uppercase text-shadow-pixel ${p.name === 'YOU' ? 'text-[#facc15]' : 'text-white'}`}>{p.name}</span>
                             {p.trend === 'up' && <TrendingUp className="w-4 h-4 text-[#10b981]" />}
                             {p.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                           </div>
                         </div>
                         <div className="text-right flex flex-col items-end pr-2">
                           <div className="text-[14px] text-white text-shadow-pixel mb-1">{p.score}</div>
                           <div className="text-[8px] text-gray-400 uppercase">EXP</div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
           )}

           {activeTab === 'rivalry' && (
              <div className="flex flex-col items-center justify-center min-h-[500px]">
                 <div className="text-[10px] text-red-500 uppercase text-shadow-pixel mb-8 animate-pulse border-y-2 border-red-500/50 py-2 w-full text-center max-w-2xl bg-red-900/20">DUEL INITIATED</div>
                 
                 <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-8 w-full max-w-4xl relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ff-inset p-4 z-10 shadow-[0_0_30px_rgba(220,38,38,0.4)] hidden md:block border-2 border-red-500 bg-black rotate-45">
                       <Swords className="w-6 h-6 text-red-500 -rotate-45" />
                    </div>

                    {/* YOU */}
                    <div className="flex-1 flex flex-col items-center text-center ff-panel p-8">
                       <span className="text-[8px] text-[#facc15] uppercase mb-6 border-b-2 border-white/20 pb-2 w-full">PARTY (YOU)</span>
                       <span className="text-xl md:text-2xl text-white text-shadow-pixel uppercase mb-4">{rankData.name}</span>
                       <span className="text-3xl text-[#facc15] text-shadow-pixel mb-8 ff-inset px-6 py-4">{currentElo}</span>
                       
                       <div className="w-full space-y-4 px-4">
                         <div className="flex justify-between items-center text-[10px]">
                           <span className="text-gray-300">ATTACK</span>
                           <span className="text-[#10b981] text-shadow-pixel">8.2</span>
                         </div>
                         <div className="w-full h-2 ff-inset"><div className="h-full bg-[#10b981]" style={{width: '82%'}}></div></div>
                         
                         <div className="flex justify-between items-center text-[10px] mt-4">
                           <span className="text-gray-300">DEFENSE</span>
                           <span className="text-red-500 text-shadow-pixel">4.1</span>
                         </div>
                         <div className="w-full h-2 ff-inset"><div className="h-full bg-red-500" style={{width: '41%'}}></div></div>
                       </div>
                    </div>

                    {/* RIVAL */}
                    <div className="flex-1 flex flex-col items-center text-center ff-panel opacity-90">
                       <span className="text-[8px] text-red-400 uppercase mb-6 border-b-2 border-white/20 pb-2 w-full bg-red-900/10">ENEMY (RIVAL)</span>
                       <span className="text-xl md:text-2xl text-gray-300 text-shadow-pixel uppercase mb-4 mt-6">Demo_Diana</span>
                       <span className="text-3xl text-red-400 text-shadow-pixel mb-8 ff-inset px-6 py-4 border-red-500/20">{currentElo - 40}</span>
                       
                       <div className="w-full space-y-4 px-8 pb-8">
                         <div className="flex justify-between items-center text-[10px]">
                           <span className="text-gray-300">ATTACK</span>
                           <span className="text-red-400 text-shadow-pixel">5.5</span>
                         </div>
                         <div className="w-full h-2 ff-inset"><div className="h-full bg-red-400" style={{width: '55%'}}></div></div>
                         
                         <div className="flex justify-between items-center text-[10px] mt-4">
                           <span className="text-gray-300">DEFENSE</span>
                           <span className="text-[#10b981] text-shadow-pixel">9.0</span>
                         </div>
                         <div className="w-full h-2 ff-inset"><div className="h-full bg-[#10b981]" style={{width: '90%'}}></div></div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 ff-panel p-6 max-w-4xl w-full border-[#facc15]/30">
                    <div className="flex items-start gap-4">
                       <Target className="w-6 h-6 text-[#facc15] shrink-0 mt-2" />
                       <div className="flex-1">
                          <h4 className="text-[10px] text-[#facc15] text-shadow-pixel uppercase mb-4 border-b-2 border-white/10 pb-2 w-full">BESTIARY ENTRY</h4>
                          <p className="text-[10px] text-gray-300 leading-loose ff-inset p-4">DIANA RELIES HEAVILY ON PRODUCT FEATURES AND CRUMBLES WHEN ASKED ABOUT ROI OR STRICT PRICING. PUSH THE "PRICE OBJECTION" TO FORCE ERRORS IN SHARED CHALLENGES.</p>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'global' && (
              <div className="flex flex-col items-center justify-start py-8 min-h-[500px] text-center w-full">
                 <Trophy className="w-16 h-16 text-[#a855f7] mb-8 drop-shadow-md" />
                 <h2 className="text-2xl md:text-3xl text-white text-shadow-pixel uppercase mb-6">THE GRANDMASTERS</h2>
                 <p className="text-[8px] text-gray-300 mb-10 max-w-xl leading-loose">THE TOP 25 HEROES ACROSS ALL REALMS GLOBALLY. REACH PRO CLASS TO QUALIFY FOR GLOBAL RANKINGS.</p>
                 
                 <div className="w-full max-w-2xl text-left ff-panel p-0 mb-8 overflow-hidden shadow-lg border-[#a855f7]/30">
                    <div className="flex justify-between items-center p-6 border-b-2 border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                       <div className="flex items-center gap-6">
                          <span className="text-[10px] text-[#facc15] text-shadow-pixel px-3 py-2 ff-inset w-12 text-center">#01</span>
                          <span className="text-[12px] md:text-[14px] text-white text-shadow-pixel uppercase">GodTier_Closer</span>
                       </div>
                       <div className="flex flex-col items-end">
                         <span className="text-[14px] text-[#a855f7] text-shadow-pixel">8,420</span>
                         <span className="text-[8px] text-gray-400">EXP</span>
                       </div>
                    </div>
                    <div className="flex justify-between items-center p-6 border-b-2 border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                       <div className="flex items-center gap-6">
                          <span className="text-[10px] text-gray-400 px-3 py-2 ff-inset w-12 text-center">#02</span>
                          <span className="text-[12px] md:text-[14px] text-white text-shadow-pixel uppercase">Glengarry_Lead</span>
                       </div>
                       <div className="flex flex-col items-end">
                         <span className="text-[14px] text-gray-300 text-shadow-pixel">8,100</span>
                         <span className="text-[8px] text-gray-400">EXP</span>
                       </div>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-white/5 hover:bg-white/10 transition-colors">
                       <div className="flex items-center gap-6">
                          <span className="text-[10px] text-[#b45309] px-3 py-2 ff-inset w-12 text-center">#03</span>
                          <span className="text-[12px] md:text-[14px] text-white text-shadow-pixel uppercase">CoffeeIsFor...</span>
                       </div>
                       <div className="flex flex-col items-end">
                         <span className="text-[14px] text-gray-300 text-shadow-pixel">7,950</span>
                         <span className="text-[8px] text-gray-400">EXP</span>
                       </div>
                    </div>
                 </div>

                 <div className="w-full max-w-2xl ff-panel-red p-6 flex flex-col md:flex-row items-center justify-between text-left group hover:brightness-110 transition-colors shadow-lg">
                     <div className="flex-1 mb-4 md:mb-0 w-full text-center md:text-left">
                         <span className="text-[8px] text-red-300 text-shadow-pixel uppercase block mb-3 border-b-2 border-white/20 pb-2 w-full md:w-fit">BOUNTY BOARD</span>
                         <h4 className="text-[14px] text-white text-shadow-pixel uppercase mb-2">DETHRONE #1</h4>
                         <p className="text-[8px] text-gray-200 leading-loose max-w-sm mx-auto md:mx-0">MAINTAIN A W/L RATIO HIGHER THAN 92% IN DIAMOND RANK TO TRIGGER THIS MYTHIC ENCOUNTER.</p>
                     </div>
                     <div className="text-center md:text-right md:pl-8 md:border-l-2 border-white/20 w-full md:w-auto h-full flex flex-col justify-center">
                        <span className="text-2xl text-white text-shadow-pixel mb-1 flex items-center justify-center gap-2">2,500</span>
                        <span className="text-[8px] text-[#facc15] uppercase text-shadow-pixel bg-black/50 px-3 py-1 mt-2 mx-auto md:mr-0 inline-block">EXP BOUNTY</span>
                     </div>
                 </div>
              </div>
           )}

         </div>
      </div>
    </div>
  );
}
