import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swords, Crosshair, ShieldAlert, TrendingUp, TrendingDown, Clock, AlertTriangle, Shield, Zap, Skull } from 'lucide-react';
import { getStoredElo, getRankData } from '../lib/game';

export default function RankedHub() {
  const currentElo = getStoredElo();
  const rankData = getRankData(currentElo);
  const [isSearching, setIsSearching] = useState(false);

  const startMatchmaking = () => {
    setIsSearching(true);
    // Simulate matchmaking delay then redirect
    setTimeout(() => {
      window.location.href = '/arena?ranked=true';
    }, 3000);
  };

  return (
    <div className="flex-1 bg-black p-2 flex justify-center text-white font-pixel h-full overflow-y-auto leading-relaxed">
      <div className="max-w-6xl w-full flex flex-col gap-4">
        
        {/* Header Section */}
        <div className="ff-panel p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
          <div className="relative z-10 flex-1">
            <span className="text-[10px] text-red-300 text-shadow-pixel uppercase mb-4 block flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> NO MAGIC ALLOWED: RAW SKILL ONLY
            </span>
            <h1 className="text-2xl md:text-3xl text-white text-shadow-pixel uppercase mb-6 mt-4">
              RANKED PROVING GROUNDS
            </h1>
            <p className="text-[8px] text-white leading-loose max-w-xl ff-inset p-4">
              NO UI CRUTCHES. NO HINT SYSTEM. NO POTIONS. YOUR AI OPPONENT OPERATES AT MAXIMUM HOSTILITY WITH DYNAMIC OBJECTIONS. PURE CONVERSATIONAL DOMINANCE DETERMINES YOUR EXP.
            </p>

            {/* High Value Target Bounty */}
            <div className="mt-8 flex items-center gap-4 ff-panel-gold p-4 max-w-xl relative overflow-hidden group">
               <div className="ff-inset p-2 shrink-0 relative z-10">
                  <Skull className="w-6 h-6 text-[#facc15]" />
               </div>
               <div className="relative z-10">
                  <span className="text-[8px] text-[#facc15] text-shadow-pixel uppercase font-bold block mb-2">BOUNTY: HIGH VALUE TARGET</span>
                  <span className="text-[10px] text-white text-shadow-pixel uppercase">"THE VETOING CFO"</span>
               </div>
               <div className="ml-auto text-right relative z-10">
                  <span className="text-[8px] text-gray-300 block uppercase mb-2">REWARD</span>
                  <span className="text-[10px] text-white text-shadow-pixel">+1.5X EXP MATCH</span>
               </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center ff-inset border-white/20 p-6 min-w-[250px]">
             <span className="text-[10px] text-gray-300 text-shadow-pixel uppercase mb-4">CURRENT CLASS</span>
             <span className={`text-xl text-shadow-pixel uppercase ${rankData.color} mb-4 text-center`}>{rankData.name}</span>
             <span className="text-2xl text-white text-shadow-pixel mb-4">{currentElo} <span className="text-[10px] text-gray-400">EXP</span></span>
             <span className="text-[8px] text-white mt-2 block border-2 border-[#10b981] bg-[#10b981]/20 px-2 py-1">TOP 4% GLOBAL</span>
             
             <button 
               onClick={startMatchmaking}
               disabled={isSearching}
               className="w-full mt-8 py-4 ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-gray-400 hover:brightness-125 text-white text-[10px] uppercase transition-all shadow-md flex items-center justify-center gap-2"
             >
               {isSearching ? (
                 <>
                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                   LOCATING...
                 </>
               ) : (
                 <>
                   ENTER QUEUE
                 </>
               )}
             </button>
             {isSearching && <p className="text-[8px] text-[#facc15] mt-4 animate-pulse uppercase">WAIT TIME: 0:14</p>}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Ruleset Rules */}
           <div className="ff-panel p-6">
             <h3 className="text-[10px] text-white text-shadow-pixel uppercase mb-6 flex items-center gap-2 border-b-[2px] border-white/20 pb-2">
               <Shield className="w-4 h-4 text-[#facc15]" /> ARENA RULES
             </h3>
             <ul className="space-y-6">
               <li className="flex items-start gap-3">
                 <div className="w-6 h-6 ff-inset flex items-center justify-center shrink-0 mt-0.5"><Zap className="w-3 h-3 text-[#facc15]" /></div>
                 <div>
                   <p className="text-[10px] text-white text-shadow-pixel uppercase mb-2">STRICT TIMING</p>
                   <p className="text-[8px] text-gray-300 leading-loose">60 SECONDS PER TURN. TIMEOUTS EQUAL INSTANT FORFEIT AND -50 EXP.</p>
                 </div>
               </li>
               <li className="flex items-start gap-3">
                 <div className="w-6 h-6 ff-inset flex items-center justify-center shrink-0 mt-0.5"><Crosshair className="w-3 h-3 text-[#facc15]" /></div>
                 <div>
                   <p className="text-[10px] text-white text-shadow-pixel uppercase mb-2">BLIND MATCHUPS</p>
                   <p className="text-[8px] text-gray-300 leading-loose">FOE WEAKNESSES AND STATS ARE HIDDEN UNTIL UNCOVERED.</p>
                 </div>
               </li>
               <li className="flex items-start gap-3">
                 <div className="w-6 h-6 ff-inset flex items-center justify-center shrink-0 mt-0.5"><AlertTriangle className="w-3 h-3 text-red-500" /></div>
                 <div>
                   <p className="text-[10px] text-red-300 text-shadow-pixel uppercase mb-2">LETHAL ATTACKS</p>
                   <p className="text-[8px] text-gray-300 leading-loose">ONE UNCHECKED MAJOR OBJECTION RESULTS IN INSTANT KO. NO WARNINGS.</p>
                 </div>
               </li>
             </ul>
           </div>

           {/* Season Progress */}
           <div className="ff-panel p-6">
             <h3 className="text-[10px] text-white text-shadow-pixel uppercase mb-6 flex items-center gap-2 border-b-[2px] border-white/20 pb-2">
               <TrendingUp className="w-4 h-4 text-[#10b981]" /> CAMPAIGN PROGRESS
             </h3>
             <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-[8px] text-white uppercase">PLACEMENT PHASE</span>
                    <span className="text-[8px] text-gray-300">3 / 5 BATTLES</span>
                  </div>
                  <div className="flex gap-2 h-4">
                    <div className="flex-1 bg-[#10b981] border-2 border-white shadow-inner"></div>
                    <div className="flex-1 bg-[#10b981] border-2 border-white shadow-inner"></div>
                    <div className="flex-1 ff-panel-red border-2 border-white shadow-inner"></div>
                    <div className="flex-1 ff-inset"></div>
                    <div className="flex-1 ff-inset"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="ff-inset p-4 text-center">
                    <span className="block text-[8px] text-gray-300 uppercase mb-4">WIN RATE</span>
                    <span className="text-[12px] text-white text-shadow-pixel">66.7%</span>
                  </div>
                  <div className="ff-inset p-4 text-center">
                    <span className="block text-[8px] text-gray-300 uppercase mb-4">LETHALITY</span>
                    <span className="text-[12px] text-white text-shadow-pixel">8.4</span>
                  </div>
                </div>
             </div>
           </div>

           {/* Match History */}
           <div className="ff-panel p-6 flex flex-col">
             <h3 className="text-[10px] text-white text-shadow-pixel uppercase mb-6 flex items-center gap-2 border-b-[2px] border-white/20 pb-2">
               <Clock className="w-4 h-4 text-[#3b82f6]" /> BATTLE LOGS
             </h3>
             <div className="flex-1 space-y-4">
               <div className="flex flex-col p-4 ff-inset hover:bg-white/10 transition-colors cursor-pointer border-l-4 border-l-red-500">
                 <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                     <span className="text-[8px] text-red-500 text-shadow-pixel uppercase">DEFEAT</span>
                     <span className="text-[8px] text-gray-400">VS CFO</span>
                   </div>
                   <div className="flex items-center gap-1 text-red-400">
                     <TrendingDown className="w-3 h-3" />
                     <span className="text-[8px]">-24 EXP</span>
                   </div>
                 </div>
                 <p className="text-[8px] text-gray-300 leading-loose">CAUSE: CAVED ON PRICING. LOST AUTHORITY.</p>
               </div>
               
               <div className="flex flex-col p-4 ff-inset hover:bg-white/10 transition-colors cursor-pointer border-l-4 border-l-[#10b981]">
                 <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                     <span className="text-[8px] text-[#10b981] text-shadow-pixel uppercase">VICTORY</span>
                     <span className="text-[8px] text-gray-400">VS VP SALES</span>
                   </div>
                   <div className="flex items-center gap-1 text-[#10b981]">
                     <TrendingUp className="w-3 h-3" />
                     <span className="text-[8px]">+32 EXP</span>
                   </div>
                 </div>
                 <p className="text-[8px] text-gray-300 leading-loose">CAUSE: FLAWLESS PATTERN INTERRUPT.</p>
               </div>

               <div className="flex flex-col p-4 ff-inset hover:bg-white/10 transition-colors cursor-pointer border-l-4 border-l-[#10b981]">
                 <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                     <span className="text-[8px] text-[#10b981] text-shadow-pixel uppercase">VICTORY</span>
                     <span className="text-[8px] text-gray-400">VS TECH LEAD</span>
                   </div>
                   <div className="flex items-center gap-1 text-[#10b981]">
                     <TrendingUp className="w-3 h-3" />
                     <span className="text-[8px]">+28 EXP</span>
                   </div>
                 </div>
                 <p className="text-[8px] text-gray-300 leading-loose">CAUSE: PINNED TO MICRO-COMMITMENTS.</p>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
