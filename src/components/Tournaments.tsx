import React from 'react';
import { Trophy, Calendar, Users, Flame, ChevronRight, Swords, Timer } from 'lucide-react';

export default function Tournaments() {
  return (
    <div className="flex-1 bg-black p-2 flex justify-center text-white font-pixel h-full overflow-y-auto leading-relaxed">
      <div className="max-w-6xl w-full flex flex-col gap-8">
        
        {/* Hero Event */}
        <div className="ff-panel relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#0a0505] to-transparent"></div>
          
          <div className="relative z-10 flex-1 p-8 flex flex-col justify-between">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <span className="text-[10px] bg-red-950/50 border border-red-900 text-red-200 uppercase px-4 py-2 flex items-center gap-3">
                  <Flame className="w-4 h-4 text-red-500" /> LIVE SANCTIONED EVENT
                </span>
                
                <div className="text-left md:text-right flex flex-col items-start md:items-end w-full md:w-auto">
                   <div className="flex items-center gap-3 bg-black py-2 px-3 border border-red-900">
                      <Timer className="w-4 h-4 text-red-500" />
                      <span className="text-lg text-white">23:42:09</span>
                   </div>
                   <span className="text-[8px] text-gray-500 uppercase mt-2">REMAINING WINDOW</span>
                </div>
             </div>

             <div className="mt-12 max-w-2xl bg-black/80 p-8 border border-[#222]">
                <h1 className="text-3xl md:text-5xl text-white uppercase mb-6 leading-tight">
                  SAAS QUARTER-END <span className="text-red-500">BLOODBATH</span>
                </h1>
                <p className="text-[10px] text-gray-400 leading-loose mb-8 border-l border-red-900 pl-4">
                  EVERY AI GATEKEEPER IS SET TO MAXIMUM HOSTILITY. BUDGETS ARE FROZEN. COMPETITORS ARE UNDERCUTTING. SECURE MEETINGS WITHIN 3 MINUTES OR FACE ELIMINATION.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                   <button className="bg-red-950 hover:bg-red-900 border border-red-800 text-red-100 p-4 uppercase transition-colors flex items-center justify-center gap-3">
                     <Swords className="w-4 h-4" /> ENTER THE BRACKET
                   </button>
                   <div className="bg-black/50 p-4 flex flex-col justify-center items-center sm:items-start border border-[#222]">
                     <span className="text-[8px] text-gray-500 uppercase mb-2">ENTRY FEE</span>
                     <span className="text-[12px] text-gray-300">50 EXP</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Global/Upcoming Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           <div className="ff-panel p-8 group transition-colors flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-[#222] pb-4">
                 <Calendar className="w-4 h-4 text-gray-500" />
                 <span className="text-[8px] text-gray-500 uppercase">UPCOMING FRIDAY</span>
              </div>
              <h3 className="text-lg text-white uppercase mb-4 transition-colors">THE VETO CLASH</h3>
              <p className="text-[8px] text-gray-500 mb-8 leading-loose flex-1">
                A GAUNTLET RUN AGAINST PURELY PROCUREMENT AND LEGAL PERSONAS. DEFENSE AGAINST REDLINING AND DISCOUNT HARVESTING.
              </p>
              <div className="flex flex-col gap-4 mt-auto">
                 <div className="flex items-center gap-3 bg-[#0a0a0a] border border-[#222] p-3">
                   <Trophy className="w-4 h-4 text-gray-400" />
                   <span className="text-[10px] text-gray-300">10K EXP POOL</span>
                 </div>
                 <button className="w-full text-[10px] border border-[#333] text-gray-400 hover:text-white hover:bg-[#111] p-3 uppercase transition-colors flex items-center justify-center gap-2">
                    NOTIFY ME <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           </div>

           <div className="ff-panel p-8 group transition-colors flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-[#222] pb-4">
                 <Users className="w-4 h-4 text-gray-500" />
                 <span className="text-[8px] text-gray-500 uppercase">ENTERPRISE EXCLUSIVE</span>
              </div>
              <h3 className="text-lg text-white uppercase mb-4 transition-colors">ACME CORP INTERNAL</h3>
              <p className="text-[8px] text-gray-500 mb-8 leading-loose flex-1">
                PRIVATE ORG TOURNAMENT. ONLY ACME REPS ALLOWED. TOP 3 GAIN PRIORITY LEAD ROUTING FOR Q3.
              </p>
              <div className="flex flex-col gap-4 mt-auto">
                 <div className="flex items-center justify-between bg-[#0a0a0a] border border-[#222] p-3">
                   <span className="text-[8px] text-gray-500 uppercase">42 REGISTERED</span>
                 </div>
                 <button className="w-full text-[10px] bg-[#111] hover:bg-[#222] border border-[#333] text-gray-300 p-3 uppercase transition-colors">
                    REGISTER
                 </button>
              </div>
           </div>

           <div className="p-8 flex flex-col items-center justify-center text-center opacity-50 grayscale border border-dashed border-[#333] min-h-[300px] rounded-lg">
              <Trophy className="w-8 h-8 text-gray-600 mb-6" />
              <h3 className="text-sm text-gray-400 uppercase mb-4">GLOBAL CHAMPIONSHIPS</h3>
              <p className="text-[8px] text-gray-500 uppercase bg-[#0a0a0a] border border-[#222] p-2">QUALIFIERS OPEN DEC 2026</p>
           </div>

        </div>
      </div>
    </div>
  );
}
