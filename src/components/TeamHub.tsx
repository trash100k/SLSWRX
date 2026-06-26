import React, { useState } from 'react';
import { Building, Users, TrendingUp, ShieldAlert, BarChart, Zap, Search, ChevronRight, Lock } from 'lucide-react';

const TEAM_MEMBERS = [
  { id: 1, name: 'Alex Mercer', role: 'Senior AE', wlr: '68%', score: 88, status: 'Online' },
  { id: 2, name: 'Sarah Jenkins', role: 'SDR', wlr: '45%', score: 72, status: 'Training' },
  { id: 3, name: 'Marcus Chen', role: 'BDR', wlr: '52%', score: 79, status: 'Offline' },
  { id: 4, name: 'Emily Rostova', role: 'AE', wlr: '61%', score: 84, status: 'Online' },
  { id: 5, name: 'David Kim', role: 'SDR', wlr: '38%', score: 65, status: 'Offline' },
];

export default function TeamHub() {
  const [isUpgrading, setIsUpgrading] = useState(false);

  return (
    <div className="flex-1 bg-black p-2 flex justify-center text-white font-pixel h-full overflow-y-auto leading-relaxed">
      <div className="max-w-6xl w-full flex flex-col gap-4">
        
        {/* Header Section */}
        <div className="ff-panel p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start justify-between shadow-md">
          
          <div className="relative z-10 flex-1 text-center md:text-left">
            <span className="text-[8px] text-[#3b82f6] text-shadow-pixel uppercase mb-4 block flex justify-center md:justify-start items-center gap-3 border-b-2 border-white/20 pb-2">
              <Building className="w-4 h-4" /> GUILD OVERSIGHT CRYSTAL
            </span>
            <h1 className="text-2xl md:text-4xl text-white text-shadow-pixel uppercase mb-6">
              TEAM <span className="text-[#3b82f6]">COMMAND</span>
            </h1>
            <p className="text-[10px] text-gray-300 leading-loose max-w-xl mx-auto md:mx-0 ff-inset p-4 bg-[#3b82f6]/10 border-[#3b82f6]/30">
              GAZE INTO THE CRYSTAL TO MONITOR YOUR ROSTER'S VITALITY AND QUEST READINESS IN REAL-TIME. IDENTIFY WEAK POINTS IN THEIR ARSENAL BEFORE THEY MARCH INTO RUIN.
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center ff-panel p-6 min-w-[280px] shadow-lg border-[#3b82f6]/50">
             <span className="text-[8px] text-[#3b82f6] text-shadow-pixel uppercase mb-3 flex items-center gap-2">
               <Lock className="w-3 h-3" /> ROYAL SEAL REQUIRED
             </span>
             <h3 className="text-[14px] text-white text-shadow-pixel uppercase mb-6 text-center">UNLOCK GUILD VAULT</h3>
             <ul className="text-[8px] text-gray-300 uppercase space-y-4 mb-8 w-full text-left ff-inset p-4 bg-white/5">
                <li className="flex items-center gap-3"><ChevronRight className="w-3 h-3 text-[#3b82f6]" /> SUMMON CUSTOM FOES</li>
                <li className="flex items-center gap-3"><ChevronRight className="w-3 h-3 text-[#3b82f6]" /> SCRYING ORB INTEGRATION</li>
                <li className="flex items-center gap-3"><ChevronRight className="w-3 h-3 text-[#3b82f6]" /> UNLIMITED PARTY TICKETS</li>
             </ul>
             
             <button 
               onClick={() => setIsUpgrading(true)}
               disabled={isUpgrading}
               className="w-full py-4 ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-[#3b82f6] text-white text-[10px] uppercase hover:brightness-125 transition-all shadow-md"
             >
               {isUpgrading ? 'UNLOCKING...' : 'PAY ROYAL TRIBUTE'}
             </button>
          </div>
        </div>

        {/* Global Org Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="ff-panel p-6 text-center hover:brightness-110 transition-colors shadow-md flex flex-col relative overflow-hidden border-[#facc15]/30">
             <div className="flex items-center justify-center gap-3 mb-4 border-b-2 border-white/20 pb-2 z-10">
               <TrendingUp className="w-5 h-5 text-[#facc15]" />
               <span className="text-[8px] text-white text-shadow-pixel uppercase">GOLD SAVED</span>
             </div>
             <span className="text-3xl text-white text-shadow-pixel my-auto z-10">14.2M</span>
             <p className="text-[8px] text-gray-400 mt-4 uppercase ff-inset p-2 bg-white/5 z-10">SHIELDED FROM RUIN</p>
           </div>
           
           <div className="ff-panel p-6 text-center hover:brightness-110 transition-colors shadow-md flex flex-col relative overflow-hidden border-[#3b82f6]/30">
             <div className="flex items-center justify-center gap-3 mb-4 border-b-2 border-white/20 pb-2 z-10">
               <Users className="w-5 h-5 text-[#3b82f6]" />
               <span className="text-[8px] text-white text-shadow-pixel uppercase">AUTOMOTON MENTOR</span>
             </div>
             <span className="text-3xl text-white text-shadow-pixel my-auto z-10">4,120</span>
             <p className="text-[8px] text-gray-400 mt-4 uppercase ff-inset p-2 bg-white/5 z-10">HOURS SPENT IN DOJO</p>
           </div>

           <div className="ff-panel p-6 text-center hover:brightness-110 transition-colors shadow-md flex flex-col">
             <div className="flex items-center justify-center gap-3 mb-4 border-b-2 border-white/20 pb-2">
               <Zap className="w-5 h-5 text-white" />
               <span className="text-[8px] text-white text-shadow-pixel uppercase">AVG DEFENSE</span>
             </div>
             <span className="text-3xl text-white text-shadow-pixel my-auto">81.2</span>
             <p className="text-[8px] text-gray-400 mt-4 uppercase ff-inset p-2 bg-white/5">GUILD AVERAGE: 64.1</p>
           </div>

           <div className="ff-panel-red p-6 text-center hover:brightness-110 transition-colors shadow-md flex flex-col border-red-500">
             <div className="flex items-center justify-center gap-3 mb-4 border-b-2 border-white/20 pb-2">
               <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
               <span className="text-[8px] text-white text-shadow-pixel uppercase">CRITICAL FAILURES</span>
             </div>
             <span className="text-3xl text-red-500 text-shadow-pixel my-auto">14</span>
             <p className="text-[8px] text-red-300 mt-4 uppercase ff-inset p-2 bg-red-900/30">REPUTATION HAZARDS CAUGHT</p>
           </div>
        </div>

        {/* Roster & Leaderboard */}
        <div className="ff-panel p-8 flex-1 flex flex-col shadow-md">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
             <h2 className="text-[12px] text-white text-shadow-pixel uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2 w-full sm:w-auto">
                 <BarChart className="w-5 h-5 text-[#3b82f6]" /> PARTY ROSTER
             </h2>
             <div className="flex items-center ff-inset bg-black p-3 w-full sm:w-auto min-w-[250px]">
                <Search className="w-4 h-4 text-gray-500 mr-3" />
                <input 
                  type="text" 
                  placeholder="SEARCH HERO..." 
                  className="bg-transparent border-none outline-none text-[10px] text-white uppercase placeholder-gray-600 w-full"
                />
             </div>
           </div>

           <div className="overflow-x-auto w-full">
             <table className="w-full text-left border-collapse min-w-[600px]">
               <thead>
                 <tr className="border-b-2 border-white/20">
                   <th className="p-4 text-[8px] text-gray-400 uppercase">HERO</th>
                   <th className="p-4 text-[8px] text-gray-400 uppercase">CLASS</th>
                   <th className="p-4 text-[8px] text-gray-400 uppercase">STATE</th>
                   <th className="p-4 text-[8px] text-gray-400 uppercase">WIN RATE</th>
                   <th className="p-4 text-[8px] text-gray-400 uppercase">EXP</th>
                   <th className="p-4 text-[8px] text-gray-400 text-right uppercase">COMMANDS</th>
                 </tr>
               </thead>
               <tbody className="leading-loose">
                  {TEAM_MEMBERS.map((member) => (
                    <tr key={member.id} className="border-b-2 border-white/10 hover:bg-white/5 transition-colors group">
                       <td className="p-4">
                         <span className="text-[10px] text-white text-shadow-pixel uppercase block">{member.name}</span>
                       </td>
                       <td className="p-4">
                         <span className="text-[8px] text-gray-400 uppercase">{member.role}</span>
                       </td>
                       <td className="p-4">
                         <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 border-2 border-black shadow-sm ${member.status === 'Online' ? 'bg-[#10b981]' : member.status === 'Training' ? 'bg-[#facc15]' : 'bg-gray-600'}`}></span>
                            <span className="text-[8px] text-gray-300 uppercase">{member.status}</span>
                         </div>
                       </td>
                       <td className="p-4">
                          <span className={`text-[10px] text-shadow-pixel ${parseInt(member.wlr) >= 50 ? 'text-[#10b981]' : 'text-red-500'}`}>{member.wlr}</span>
                       </td>
                       <td className="p-4">
                          <span className="text-[10px] text-white text-shadow-pixel">{member.score}</span>
                       </td>
                       <td className="p-4 text-right">
                         <button className="text-[8px] uppercase text-[#3b82f6] hover:text-white flex items-center justify-end w-full gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           VIEW LOGS <ChevronRight className="w-4 h-4" />
                         </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>

        </div>

      </div>
    </div>
  );
}
