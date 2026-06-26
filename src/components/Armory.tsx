import React, { useState } from 'react';
import { Shield, Book, Crosshair, Zap, Briefcase, Lock, ChevronRight, Activity } from 'lucide-react';

export default function Armory() {
  const [activeFramework, setActiveFramework] = useState('challenger');

  return (
    <div className="flex-1 bg-black p-2 flex justify-center text-white font-pixel h-full overflow-y-auto leading-relaxed">
      <div className="max-w-6xl w-full flex flex-col gap-4">
        
        {/* Header Section */}
        <div className="ff-panel p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start justify-between shadow-md">
          
          <div className="relative z-10 flex-1 text-center md:text-left">
            <span className="text-[8px] text-[#facc15] text-shadow-pixel uppercase mb-4 block flex justify-center md:justify-start items-center gap-3 border-b-2 border-white/20 pb-2">
              <Shield className="w-4 h-4" /> LOADOUT CACHE
            </span>
            <h1 className="text-3xl md:text-5xl text-white text-shadow-pixel uppercase mb-6">
              THE <span className="text-[#facc15]">ARMORY</span>
            </h1>
            <p className="text-[10px] text-gray-300 leading-loose max-w-xl mx-auto md:mx-0 ff-inset p-4 bg-black/50 border-[#facc15]/30">
              CONFIGURE YOUR CONVERSATIONAL WEAPONRY BEFORE STEPPING INTO THE ARENA. EQUIP FRAMEWORKS, SELECT BATTLECARDS, AND TUNE YOUR AI CO-PILOT.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
           {/* Active Framework Selection */}
           <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="ff-panel p-6 flex flex-col h-full shadow-md">
                 <h2 className="text-[10px] text-white text-shadow-pixel mb-6 uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2">
                     <Book className="w-5 h-5 text-[#3b82f6]" /> OPERATIONAL FRAMEWORKS
                 </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
                    
                    {/* Challenger */}
                    <div 
                      onClick={() => setActiveFramework('challenger')}
                      className={`ff-panel p-6 flex flex-col cursor-pointer transition-all shadow-sm ${activeFramework === 'challenger' ? 'border-[#facc15] shadow-[0_0_20px_rgba(250,204,21,0.2)] bg-[#facc15]/10 transform scale-105 z-10' : 'border-gray-600 hover:brightness-110 opacity-60 hover:opacity-100'}`}
                    >
                       <div className={`w-12 h-12 ff-inset bg-black flex items-center justify-center mb-4 ${activeFramework === 'challenger' ? 'border-2 border-[#facc15]' : ''}`}>
                          <Crosshair className={`w-6 h-6 ${activeFramework === 'challenger' ? 'text-[#facc15]' : 'text-gray-500'}`} />
                       </div>
                       <h3 className="text-[12px] text-white text-shadow-pixel uppercase mb-4">THE CHALLENGER</h3>
                       <p className="text-[8px] text-gray-400 leading-loose flex-1 mb-4">TEACH, TAILOR, TAKE CONTROL. DISRUPT THEIR BUSINESS MODEL.</p>
                       <div className={`mt-auto text-[8px] uppercase p-3 text-center transition-colors ${activeFramework === 'challenger' ? 'ff-panel border-2 border-[#facc15] text-[#facc15] shadow-inner bg-black' : 'ff-inset bg-white/5 text-gray-500 border-2 border-transparent'}`}>
                          {activeFramework === 'challenger' ? 'EQUIPPED' : 'CLICK TO EQUIP'}
                       </div>
                    </div>

                    {/* MEDDPICC */}
                    <div 
                      onClick={() => setActiveFramework('meddpicc')}
                      className={`ff-panel p-6 flex flex-col cursor-pointer transition-all shadow-sm ${activeFramework === 'meddpicc' ? 'border-[#facc15] shadow-[0_0_20px_rgba(250,204,21,0.2)] bg-[#facc15]/10 transform scale-105 z-10' : 'border-gray-600 hover:brightness-110 opacity-60 hover:opacity-100'}`}
                    >
                       <div className={`w-12 h-12 ff-inset bg-black flex items-center justify-center mb-4 ${activeFramework === 'meddpicc' ? 'border-2 border-[#facc15]' : ''}`}>
                          <Activity className={`w-6 h-6 ${activeFramework === 'meddpicc' ? 'text-[#facc15]' : 'text-gray-500'}`} />
                       </div>
                       <h3 className="text-[12px] text-white text-shadow-pixel uppercase mb-4">MEDDPICC</h3>
                       <p className="text-[8px] text-gray-400 leading-loose flex-1 mb-4">ENTERPRISE MATRIX. VALIDATES METRICS & ECONOMIC BUYERS.</p>
                       <div className={`mt-auto text-[8px] uppercase p-3 text-center transition-colors ${activeFramework === 'meddpicc' ? 'ff-panel border-2 border-[#facc15] text-[#facc15] shadow-inner bg-black' : 'ff-inset bg-white/5 text-gray-500 border-2 border-transparent'}`}>
                          {activeFramework === 'meddpicc' ? 'EQUIPPED' : 'CLICK TO EQUIP'}
                       </div>
                    </div>

                    {/* Sandler */}
                    <div className="ff-panel p-6 flex flex-col relative overflow-hidden grayscale opacity-40 cursor-not-allowed">
                       <Lock className="absolute top-4 right-4 w-4 h-4 text-gray-500" />
                       <div className="w-12 h-12 ff-inset bg-black flex items-center justify-center mb-4 border-2 border-gray-700">
                          <Briefcase className="w-6 h-6 text-gray-600" />
                       </div>
                       <h3 className="text-[12px] text-gray-400 text-shadow-pixel uppercase mb-4">SANDLER SUBMARINE</h3>
                       <p className="text-[8px] text-gray-500 leading-loose flex-1 mb-4">PAIN FUNNEL MECHANICS.</p>
                       <div className="mt-auto text-[8px] uppercase p-3 text-center ff-inset bg-black border-2 border-gray-700 text-gray-600">
                          LVL 20 REQUIRED
                       </div>
                    </div>

                 </div>
              </div>
           </div>

           {/* Battlecards (Right Column) */}
           <div className="ff-panel p-6 flex flex-col gap-6 shadow-md border-[#a855f7]/30">
               <h2 className="text-[10px] text-white text-shadow-pixel mb-4 uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2">
                   <Zap className="w-5 h-5 text-[#a855f7]" /> ACTIVE BATTLECARDS
               </h2>
               <p className="text-[8px] text-gray-400 uppercase leading-loose ff-inset p-3 bg-black/50">SLOT COMPETITOR INTEL FOR LIVE-CALL ASSISTANCE.</p>
               
               <div className="space-y-4 flex-1">
                  <div className="ff-inset bg-white/5 border-2 border-white/10 p-4 group hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center shadow-sm">
                     <div className="pl-2 border-l-4 border-[#a855f7]">
                        <span className="text-[8px] text-[#a855f7] uppercase block mb-2">COMPETITOR INTEL</span>
                        <span className="text-[10px] text-white text-shadow-pixel uppercase">VS. LEGACY CORP</span>
                     </div>
                     <ChevronRight className="w-5 h-5 text-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="ff-inset bg-white/5 border-2 border-white/10 p-4 group hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center shadow-sm">
                     <div className="pl-2 border-l-4 border-[#a855f7]">
                        <span className="text-[8px] text-[#a855f7] uppercase block mb-2">OBJECTION MATRIX</span>
                        <span className="text-[10px] text-white text-shadow-pixel uppercase">FREEZE DEFLECTION</span>
                     </div>
                     <ChevronRight className="w-5 h-5 text-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="ff-panel bg-black border-2 border-dashed border-gray-700 p-6 flex items-center justify-center text-gray-500 hover:text-white hover:border-[#a855f7] cursor-pointer transition-colors mt-6 shadow-inner">
                     <span className="text-[8px] uppercase flex items-center gap-3"><Lock className="w-4 h-4" /> SLOT LOCKED (RANK UP)</span>
                  </div>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
}
