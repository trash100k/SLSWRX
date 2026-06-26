import React from 'react';
import { Film, Play, SkipForward, Volume2, Eye, MessageSquare, AlertTriangle, Crosshair } from 'lucide-react';

export default function FilmRoom() {
  return (
    <div className="flex-1 bg-black p-2 flex justify-center text-white font-pixel h-full overflow-y-auto leading-relaxed overflow-x-hidden">
      <div className="max-w-6xl w-full flex flex-col gap-4 h-full">
        
        {/* Header */}
        <div className="ff-panel p-6 shrink-0 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full text-center md:text-left">
            <div className="w-16 h-16 ff-inset bg-black flex items-center justify-center shrink-0 border-2 border-[#3b82f6]">
              <Film className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <div>
              <span className="text-[8px] text-[#3b82f6] text-shadow-pixel uppercase block mb-3 border-b-2 border-white/20 pb-2">GAME TAPE REVIEW</span>
              <h1 className="text-2xl md:text-3xl text-white text-shadow-pixel uppercase mt-2">THE FILM ROOM</h1>
            </div>
          </div>
          <div className="mt-6 md:mt-0 w-full md:w-auto relative z-10">
            <p className="text-[10px] text-gray-300 ff-inset p-4 bg-black/50">"EXPOSE YOUR FLAWS. STEAL THEIR TACTICS."</p>
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-[500px]">
           {/* Video / Player Area */}
           <div className="flex-1 ff-panel flex flex-col relative shadow-md">
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden border-b-2 border-white/20">
                 {/* Visualizer Mock */}
                 <div className="flex items-center gap-1 mb-8 opacity-50">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-2 bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ height: `${Math.max(10, Math.random() * 60)}px`, opacity: i % 2 === 0 ? 0.8 : 0.4 }}></div>
                    ))}
                 </div>
                 <h2 className="text-3xl text-white text-shadow-pixel uppercase mb-4 opacity-50">AUDIO PLAYBACK</h2>
                 <p className="text-[8px] text-white uppercase ff-panel p-2 shadow-inner bg-black border-2 border-gray-700">VETOING CFO • DIAMOND RANK CLEAR</p>
              </div>

              {/* Playback Controls */}
              <div className="h-20 bg-black flex items-center px-6 gap-6 shrink-0 relative z-10 bottom-0">
                 <button className="w-12 h-12 ff-panel flex items-center justify-center bg-gray-900 border-2 border-white text-white transition-colors hover:brightness-125 shadow-sm shrink-0">
                   <Play className="w-6 h-6 ml-1" fill="currentColor" />
                 </button>
                 <button className="w-10 h-10 ff-inset bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0">
                   <SkipForward className="w-5 h-5" />
                 </button>
                 
                 {/* Timeline */}
                 <div className="flex-1 flex flex-col gap-2">
                    <div className="w-full h-4 ff-inset bg-black relative shadow-inner overflow-hidden border-2 border-white/20">
                       <div className="absolute top-0 left-0 bottom-0 bg-[#3b82f6] shadow-sm w-1/3"></div>
                       {/* Markers */}
                       <div className="absolute top-0 left-[20%] w-1 h-full bg-red-500 z-10 shadow-sm" title="Objection"></div>
                       <div className="absolute top-0 left-[60%] w-1 h-full bg-[#facc15] z-10 shadow-sm" title="Deflection"></div>
                       <div className="absolute top-0 left-[85%] w-1 h-full bg-[#10b981] z-10 shadow-sm" title="Micro-Commitment"></div>
                    </div>
                    <div className="flex justify-between text-[8px] text-gray-500 uppercase">
                       <span>01:14</span>
                       <span>04:30</span>
                    </div>
                 </div>

                 <Volume2 className="w-6 h-6 text-gray-500 md:block hidden shrink-0" />
              </div>
           </div>

           {/* Transcript / Breakdown */}
           <div className="lg:w-96 ff-panel flex flex-col shrink-0 h-full shadow-md">
              <div className="p-6 border-b-2 border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <h3 className="text-[10px] text-white text-shadow-pixel uppercase flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-[#3b82f6]" /> AI DIAGNOSTIC
                 </h3>
                 <span className="text-[8px] ff-inset bg-white/10 px-2 py-1 uppercase">SYNCED</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                 
                 <div className="flex flex-col gap-3">
                    <span className="text-[8px] uppercase text-gray-500 flex items-center gap-2">
                       01:14 • <span className="text-red-500 text-shadow-pixel">CFO PERSONA</span>
                    </span>
                    <p className="text-[10px] text-white leading-loose ff-inset bg-black/50 p-4 border-l-4 border-red-500 shadow-sm">
                      "LISTEN, I DON'T HAVE TIME FOR A FEATURE DUMP. WE'RE LOCKING DOWN SPENDING DEEP FOR THE QUARTER. WHAT MAKES YOU THINK WE HAVE BUDGET?"
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-red-500 ff-panel-red border-red-500 bg-red-900/10 p-3 shadow-sm">
                       <AlertTriangle className="w-4 h-4 shrink-0" />
                       <span className="text-[8px] uppercase leading-loose">HARD PRICE OBJECTION</span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-3">
                    <span className="text-[8px] uppercase text-[#3b82f6] flex items-center gap-2">
                       01:18 • <span className="text-white text-shadow-pixel">GODTIER_CLOSER</span>
                    </span>
                    <p className="text-[10px] text-white leading-loose ff-inset bg-[#3b82f6]/10 p-4 border-l-4 border-[#3b82f6] shadow-sm">
                      "I AGREE COMPLETELY. IN FACT, IF YOU'RE NOT LOCKING DOWN SPENDING RIGHT NOW, YOU'RE NOT PAYING ATTENTION TO THE MARKET. I DIDN'T CALL TO ASK FOR BUDGET TODAY."
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[#3b82f6] ff-panel border-[#3b82f6] bg-[#3b82f6]/10 p-3 shadow-sm">
                       <Crosshair className="w-4 h-4 shrink-0" />
                       <span className="text-[8px] uppercase leading-loose">FLAWLESS PATTERN INTERRUPT. +14 EXP</span>
                    </div>
                 </div>

              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
