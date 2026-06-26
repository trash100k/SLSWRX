import React from 'react';
import { User, Award, Shield, Zap, TrendingUp, Share2, MapPin, Building, Calendar, Star, CheckCircle, Crosshair, Flame, Skull } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const performanceData = [
  { day: 'W1', score: 65 },
  { day: 'W2', score: 72 },
  { day: 'W3', score: 68 },
  { day: 'W4', score: 85 },
  { day: 'W5', score: 82 },
  { day: 'W6', score: 90 },
  { day: 'W7', score: 94 },
];

const skillData = [
  { subject: 'Objection Handling', A: 90, fullMark: 100 },
  { subject: 'Call Control', A: 85, fullMark: 100 },
  { subject: 'Discovery', A: 70, fullMark: 100 },
  { subject: 'Closing', A: 80, fullMark: 100 },
  { subject: 'Empathy', A: 65, fullMark: 100 },
];

const RECENT_ACHIEVEMENTS = [
  { id: 1, title: 'Gatekeeper Assassin', desc: 'Bypassed 50 synthetic gatekeepers.', icon: Shield, color: 'text-amber-500' },
  { id: 2, title: 'Flawless Demo', desc: 'Completed a 10-min gauntlet without filler words.', icon: Star, color: 'text-purple-500' },
  { id: 3, title: 'Cold Call Surgeon', desc: 'Achieved an 85+ score in 10 consecutive ranked runs.', icon: Zap, color: 'text-sky-500' },
];

export default function Profile() {
  return (
    <div className="flex-1 bg-black p-2 flex justify-center text-white font-pixel h-full overflow-y-auto leading-relaxed overflow-x-hidden">
      <div className="max-w-5xl w-full flex flex-col gap-4">
        
        {/* Profile Header section */}
        <div className="ff-panel p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start justify-between shrink-0 shadow-md">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10 w-full md:w-auto">
            <div className="w-32 h-32 ff-inset bg-black flex items-center justify-center shrink-0 shadow-inner">
              <User className="w-16 h-16 text-gray-600" />
            </div>
            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                 <h1 className="text-2xl md:text-3xl text-white text-shadow-pixel uppercase">Hero_Mercer</h1>
                 <div className="ff-panel-gold flex items-center gap-2 px-3 py-1 shadow-sm">
                   <Award className="w-4 h-4 text-[#facc15]" />
                   <span className="text-[10px] text-white text-shadow-pixel uppercase">PALADIN CLASS</span>
                 </div>
              </div>
              <p className="text-[10px] text-[#facc15] text-shadow-pixel uppercase mb-6 border-b-2 border-white/20 pb-2 inline-block">GRANDMASTER OF SALES</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[8px] text-gray-300 uppercase">
                 <div className="flex items-center gap-2 ff-inset px-3 py-2 bg-white/5"><Building className="w-3 h-3 text-[#3b82f6]" /> GILGAMESH CORP</div>
                 <div className="flex items-center gap-2 ff-inset px-3 py-2 bg-white/5"><MapPin className="w-3 h-3 text-red-400" /> SECTOR 7</div>
                 <div className="flex items-center gap-2 ff-inset px-3 py-2 bg-white/5"><Calendar className="w-3 h-3 text-[#10b981]" /> JOINED AC 2026</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-6 md:mt-2 h-fit">
            <button className="ff-panel hover:brightness-125 py-4 px-6 text-[10px] uppercase transition-colors flex items-center justify-center gap-3 shadow-md w-full sm:w-auto">
              <Share2 className="w-4 h-4" /> SHARE STATS
            </button>
            <button className="ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-[#3b82f6] text-[#3b82f6] py-4 px-6 text-[10px] uppercase tracking-widest hover:brightness-125 transition-colors flex items-center justify-center shadow-md w-full sm:w-auto">
              LINK COMM-SPHERE
            </button>
          </div>
        </div>

        {/* 2-Column Stats Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
           <div className="lg:col-span-2 flex flex-col gap-4">
              
              <div className="ff-panel p-6 shadow-md border-purple-500/30 font-sans">
                <h2 className="text-[10px] text-white text-shadow-pixel mb-6 uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2 font-pixel">
                    <TrendingUp className="w-5 h-5 text-purple-400" /> EXP GAIN HISTORY
                </h2>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#555" tick={{ fill: '#aaa', fontFamily: 'monospace' }} />
                      <YAxis stroke="#555" tick={{ fill: '#aaa', fontFamily: 'monospace' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '2px solid #555', color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontFamily: '"Press Start 2P"', borderRadius: '0' }}
                        itemStyle={{ color: '#a855f7' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                 <div className="ff-panel p-6 h-full flex flex-col shadow-md font-sans border-[#facc15]/30">
                   <h2 className="text-[10px] text-white text-shadow-pixel mb-6 uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2 font-pixel">
                      <Zap className="w-5 h-5 text-[#facc15]" /> COMBAT STATS
                   </h2>
                   <div className="flex-1 w-full h-[200px] text-[10px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={skillData}>
                          <PolarGrid stroke="#555" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#ccc', fontSize: '9px', fontFamily: '"Press Start 2P"' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#444" tick={{ fill: '#888', fontSize: '9px' }} />
                          <Radar name="Skills" dataKey="A" stroke="#facc15" strokeWidth={2} fill="#facc15" fillOpacity={0.4} />
                        </RadarChart>
                     </ResponsiveContainer>
                   </div>
                 </div>

                 <div className="ff-panel p-6 h-full relative overflow-hidden group shadow-md border-red-500/30 flex flex-col">
                    <h2 className="text-[10px] text-white text-shadow-pixel mb-6 uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2 relative z-10">
                      <Flame className="w-5 h-5 text-red-500" /> BATTLE RECORDS
                   </h2>
                   <p className="text-[10px] text-gray-300 mb-6 leading-loose relative z-10 ff-inset p-4 bg-black/50">
                     "MAGIC ISN'T REAL. BUT A FLAWLESS PITCH COMES REMARKABLY CLOSE."
                   </p>
                   <div className="space-y-4 relative z-10 mt-auto">
                      <div className="ff-inset p-4 bg-white/5 flex justify-between items-center group-hover:bg-white/10 transition-colors">
                         <span className="text-[8px] text-gray-400 uppercase">SERVER RANK</span>
                         <span className="text-[12px] text-shadow-pixel text-[#facc15]">TOP 1.2%</span>
                      </div>
                      <div className="ff-inset p-4 bg-white/5 flex justify-between items-center group-hover:bg-white/10 transition-colors">
                         <span className="text-[8px] text-gray-400 uppercase">FOES VANQUISHED</span>
                         <span className="text-[12px] text-white text-shadow-pixel flex items-center gap-2"><Skull className="w-4 h-4 text-red-500"/> 142</span>
                      </div>
                      <div className="ff-inset p-4 bg-white/5 flex justify-between items-center group-hover:bg-white/10 transition-colors">
                         <span className="text-[8px] text-gray-400 uppercase">WIN STREAK</span>
                         <span className="text-[12px] text-white text-shadow-pixel flex items-center gap-2"><Crosshair className="w-4 h-4 text-[#3b82f6]"/> 14</span>
                      </div>
                   </div>
                 </div>
              </div>

           </div>

           {/* Achievements & Showcase */}
           <div className="ff-panel p-6 flex flex-col gap-8 shadow-md">
              <div>
                <h2 className="text-[10px] text-white text-shadow-pixel mb-6 uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2">
                    <Award className="w-5 h-5 text-white" /> TROPHY CASE
                </h2>
                <div className="space-y-4">
                  {RECENT_ACHIEVEMENTS.map((ach) => (
                    <div key={ach.id} className="flex gap-4 p-4 ff-inset bg-white/5 hover:bg-white/10 transition-colors items-center">
                       <div className="w-12 h-12 shrink-0 bg-black flex items-center justify-center border-2 border-white/20">
                         <ach.icon className={`w-6 h-6 ${ach.color}`} />
                       </div>
                       <div>
                         <h3 className="text-[10px] text-white text-shadow-pixel uppercase mb-2">{ach.title}</h3>
                         <p className="text-[8px] text-gray-400 leading-loose">{ach.desc}</p>
                       </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-4 ff-panel border-2 border-gray-600 text-[10px] text-gray-400 hover:text-white uppercase transition-colors shadow-sm">
                  VIEW ALL LOOT
                </button>
              </div>

              <div className="mt-auto border-t-2 border-white/20 pt-8">
                <h2 className="text-[10px] text-white text-shadow-pixel mb-4 uppercase">VERIFIED CERTIFICATE</h2>
                <div className="ff-panel-gold border-[#facc15] p-6 shadow-md bg-[#facc15]/10">
                   <div className="flex items-center justify-center gap-4 mb-4">
                     <Shield className="w-8 h-8 text-[#facc15] drop-shadow-md" />
                     <span className="text-[10px] sm:text-[12px] text-white text-shadow-pixel uppercase leading-loose text-center">LVL 4 OBJECTION MAGE</span>
                   </div>
                   <p className="text-[8px] text-gray-300 mb-6 text-center leading-loose underline decoration-white/30">CERTIFIED BY SYSTEM. TOP 8% GLOBALLY.</p>
                   <button className="w-full ff-panel border-2 border-white bg-gradient-to-b from-gray-800 to-gray-900 text-white py-4 text-[10px] uppercase hover:brightness-125 transition-colors shadow-md">
                     EXPORT TO SCROLL
                   </button>
                </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
