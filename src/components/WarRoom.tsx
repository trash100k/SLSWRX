import React, { useState } from 'react';
import { Target, Swords, Users, ShieldAlert, Crosshair, Trophy, Flame, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WarRoom() {
  const [activeTab, setActiveTab] = useState<'board' | 'declare'>('board');
  const [visibility, setVisibility] = useState<'public' | 'internal'>('public');

  const [opponent, setOpponent] = useState('');
  const [battleType, setBattleType] = useState('gauntlet');

  const handleDeclare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponent.trim()) return;
    alert(`WAR DECLARED ON ${opponent.toUpperCase()}`);
    setOpponent('');
  };

  return (
    <div className="flex-1 bg-black p-4 flex justify-center text-white font-pixel h-full overflow-y-auto">
      <div className="max-w-6xl w-full flex flex-col gap-8">
        
        <div className="ff-panel p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#222]">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl text-red-500 uppercase flex items-center justify-center md:justify-start gap-4">
              <Swords className="w-8 h-8" /> THE WAR ROOM
            </h1>
            <p className="text-[10px] text-gray-500 max-w-xl leading-loose">
              CALL OUT YOUR COLLEAGUES. PROVE YOUR METTLE. RESULTS ARE PUBLIC. ONLY ONE SURVIVES.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('board')}
              className={`px-6 py-3 text-[10px] uppercase transition-colors border ${activeTab === 'board' ? 'bg-[#111] border-red-500 text-red-500' : 'border-[#333] text-gray-500 hover:text-white'}`}
            >
              WAR BOARD
            </button>
            <button 
              onClick={() => setActiveTab('declare')}
              className={`px-6 py-3 text-[10px] uppercase transition-colors border ${activeTab === 'declare' ? 'bg-[#111] border-red-500 text-red-500' : 'border-[#333] text-gray-500 hover:text-white'}`}
            >
              DECLARE WAR
            </button>
          </div>
        </div>

        {activeTab === 'board' ? (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 mb-4">
               <button 
                 onClick={() => setVisibility('public')}
                 className={`flex items-center gap-2 px-4 py-2 text-[8px] uppercase border transition-colors ${visibility === 'public' ? 'border-gray-300 text-white' : 'border-[#222] text-gray-500'}`}
               >
                 <Eye className="w-3 h-3" /> GLOBAL (PUBLIC)
               </button>
               <button 
                 onClick={() => setVisibility('internal')}
                 className={`flex items-center gap-2 px-4 py-2 text-[8px] uppercase border transition-colors ${visibility === 'internal' ? 'border-[#a855f7] text-[#a855f7]' : 'border-[#222] text-gray-500'}`}
               >
                 <Users className="w-3 h-3" /> INTERNAL (ACME CORP)
               </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-[#0a0a0a] border border-[#222] p-6 flex flex-col rounded-lg">
                  <h3 className="text-[10px] text-gray-300 uppercase mb-6 flex items-center gap-2 border-b border-[#222] pb-4">
                     <Flame className="w-4 h-4 text-orange-500" /> ACTIVE BATTLES
                  </h3>
                  <div className="flex flex-col gap-4">
                     {[
                       { p1: 'ALPHA', p2: 'MIKE_SALES', mode: 'GAUNTLET', status: 'ROUND 2/3' },
                       { p1: 'SARAH_VP', p2: 'JOSH_AE', mode: 'RAPID FIRE', status: 'WAITING ON JOSH' }
                     ].map((b, i) => (
                       <div key={i} className="flex justify-between items-center p-4 border border-[#333] bg-[#050505]">
                          <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-3 text-[10px]">
                                <span className="text-white">{b.p1}</span>
                                <span className="text-red-500 text-[8px]">VS</span>
                                <span className="text-gray-400">{b.p2}</span>
                             </div>
                             <span className="text-[8px] text-gray-600">MODE: {b.mode}</span>
                          </div>
                          <span className="text-[8px] text-yellow-500 uppercase animate-pulse">{b.status}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-[#0a0a0a] border border-[#222] p-6 flex flex-col rounded-lg">
                  <h3 className="text-[10px] text-gray-300 uppercase mb-6 flex items-center gap-2 border-b border-[#222] pb-4">
                     <Trophy className="w-4 h-4 text-yellow-500" /> RECENT CASUALTIES
                  </h3>
                  <div className="flex flex-col gap-4">
                     {[
                       { p1: 'DAVID_SDR', p2: 'ALPHA', winner: 'p1', mode: 'NEGOTIATION', score: '95K v 80K' },
                       { p1: 'RYAN_AE', p2: 'CHRIS_VP', winner: 'p2', mode: 'OBJECTION', score: '3-0 SWEEP' }
                     ].map((b, i) => (
                       <div key={i} className="flex justify-between items-center p-4 border border-[#333] bg-[#050505]">
                          <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-3 text-[10px]">
                                <span className={b.winner === 'p1' ? 'text-green-500' : 'text-red-500 line-through opacity-50'}>{b.p1}</span>
                                <span className="text-gray-600 text-[8px]">VS</span>
                                <span className={b.winner === 'p2' ? 'text-green-500' : 'text-red-500 line-through opacity-50'}>{b.p2}</span>
                             </div>
                             <span className="text-[8px] text-gray-500">MODE: {b.mode}</span>
                          </div>
                          <span className="text-[8px] text-gray-400">{b.score}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            <div className="bg-[#0a0a0a] border border-red-900/50 p-8 rounded-lg">
               <h3 className="text-[12px] text-red-400 uppercase mb-8 flex items-center gap-2 border-b border-red-900/50 pb-4">
                  <Target className="w-5 h-5" /> INITIATE COMBAT
               </h3>
               
               <form onSubmit={handleDeclare} className="flex flex-col gap-6">
                 <div className="flex flex-col gap-3">
                   <label className="text-[10px] text-gray-400">TARGET CALL SIGN / EMAIL</label>
                   <input 
                     value={opponent}
                     onChange={e => setOpponent(e.target.value)}
                     className="bg-[#050505] border border-[#333] p-4 text-[10px] text-white focus:border-red-500 focus:outline-none transition-colors"
                     placeholder="e.g. josh@acme.com"
                     required
                   />
                 </div>

                 <div className="flex flex-col gap-3">
                   <label className="text-[10px] text-gray-400">COMBAT MODE</label>
                   <select 
                     value={battleType}
                     onChange={e => setBattleType(e.target.value)}
                     className="bg-[#050505] border border-[#333] p-4 text-[10px] text-white focus:border-red-500 focus:outline-none transition-colors appearance-none"
                   >
                     <option value="gauntlet">THE GAUNTLET (3 ROUNDS)</option>
                     <option value="rapid_fire">RAPID FIRE OBJECTIONS</option>
                     <option value="negotiation">THE REDLINE (DEAL DESK)</option>
                   </select>
                 </div>

                 <div className="flex flex-col gap-3">
                   <label className="text-[10px] text-gray-400">VISIBILITY</label>
                   <div className="grid grid-cols-2 gap-4">
                     <button 
                       type="button"
                       onClick={() => setVisibility('public')}
                       className={`p-4 border transition-colors flex items-center justify-center gap-2 text-[8px] uppercase ${visibility === 'public' ? 'border-gray-300 text-white bg-white/5' : 'border-[#333] text-gray-500'}`}
                     >
                       <Eye className="w-4 h-4" /> PUBLIC (GLOBAL)
                     </button>
                     <button 
                       type="button"
                       onClick={() => setVisibility('internal')}
                       className={`p-4 border transition-colors flex items-center justify-center gap-2 text-[8px] uppercase ${visibility === 'internal' ? 'border-[#a855f7] text-[#a855f7] bg-[#a855f7]/5' : 'border-[#333] text-gray-500'}`}
                     >
                       <EyeOff className="w-4 h-4" /> INTERNAL ONLY
                     </button>
                   </div>
                 </div>

                 <button 
                   type="submit"
                   className="mt-8 py-6 w-full bg-red-950 border border-red-500 text-red-500 hover:bg-red-900 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                 >
                   DECLARE WAR
                 </button>
               </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
