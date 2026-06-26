import { Link } from 'react-router-dom';
import { Play, TrendingUp, Skull, Shield, Flame, Award, Users, ArrowRight, Activity, Target, ShieldAlert, TerminalSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { getStoredElo, getRankData, getBadges } from '../lib/game';

const mockEloData = [
  { call: '1', elo: 1750 },
  { call: '2', elo: 1765 },
  { call: '3', elo: 1740 },
  { call: '4', elo: 1780 },
  { call: '5', elo: 1810 },
  { call: '6', elo: 1805 },
  { call: '7', elo: 1842 },
];

export default function Dashboard() {
  const currentElo = getStoredElo();
  const rankData = getRankData(currentElo);
  const badges = getBadges();

  return (
    <div className="flex-1 bg-black p-2 flex justify-center text-white font-pixel h-full overflow-y-auto leading-relaxed">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full max-w-[1400px] h-fit">
        
        {/* Main Terminal Output Area */}
        <div className="lg:col-span-8 space-y-4 flex flex-col">
          
          {/* Header Character Block */}
          <div className="ff-panel p-6 shrink-0 flex flex-col gap-4">
             <div className="flex justify-between items-start border-b border-[#222] pb-6">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 ff-inset flex flex-col items-center justify-center relative">
                     <Award className="w-8 h-8 text-gray-300" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[8px] sm:text-[10px] text-gray-500">JOB: ACCOUNT EXECUTIVE</span>
                    <span className={`text-sm sm:text-lg text-white mt-1`}>{rankData.name.replace('PLATINUM', 'PLATINUM')}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right gap-2">
                   <span className="text-[8px] sm:text-[10px] text-gray-400">
                     STATUS: NORMAL
                   </span>
                   <span className="text-[8px] text-gray-500">HP: 9999/9999</span>
                   <span className="text-[8px] text-gray-500">MP: 999/999</span>
                </div>
             </div>

             <div className="w-full flex-col gap-3 flex">
                <div className="flex justify-between text-[8px] sm:text-[10px] px-1 text-gray-400">
                  <span>
                    {rankData.xpNeeded > 0 ? `NEXT LEVEL: ${rankData.xpNeeded} EXP` : 'MAX LEVEL EXCEEDED'}
                  </span>
                  <span>LV {Math.round(rankData.progress)}</span>
                </div>
                <div className="h-2 w-full ff-inset relative p-0.5 box-border">
                  <div className="h-full bg-white bg-opacity-80" style={{ width: `${rankData.progress}%` }}>
                  </div>
                </div>
             </div>
          </div>

          {/* ELO Trend Graph - Quest History */}
          <div className="ff-panel p-6 shrink-0 h-64 flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b border-[#222] pb-4">
                  <h2 className="text-[10px] text-gray-300 flex items-center gap-2 uppercase">
                      <TerminalSquare className="w-4 h-4 text-gray-500" /> EXP HISTORY
                  </h2>
                  <span className="text-[8px] text-gray-500">LAST 7 BATTLES</span>
              </div>
              <div className="w-full flex-1 ff-inset p-2">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockEloData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="2 4" stroke="#ffffff" strokeOpacity={0.2} vertical={false} />
                          <XAxis dataKey="call" stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 8, fontFamily: '"Press Start 2P"' }} />
                          <YAxis stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 8, fontFamily: '"Press Start 2P"' }} domain={['dataMin - 10', 'auto']} />
                          <Tooltip 
                              contentStyle={{ background: 'linear-gradient(to bottom, #00127a 0%, #000735 100%)', borderColor: '#ffffff', color: '#fff', fontSize: '8px', fontFamily: '"Press Start 2P"', borderRadius: 4, borderWidth: '2px', boxShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}
                              itemStyle={{ color: '#ffffff', textShadow: '2px 2px 0px #000' }}
                              labelStyle={{ display: 'none' }}
                          />
                          <Line type="step" dataKey="elo" stroke="#ffffff" strokeWidth={3} dot={{ r: 4, fill: '#00127a', stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#ffffff', stroke: '#00127a', strokeWidth: 2 }} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div className="ff-panel p-6 flex flex-col">
              <h2 className="text-[10px] text-gray-300 mb-6 flex items-center gap-2 border-b border-[#222] pb-4">
                  <Activity className="w-4 h-4 text-gray-500" /> ATTRIBUTES
              </h2>
              
              <div className="flex flex-col gap-4 flex-1 px-1">
                 <div className="flex justify-between items-center group">
                    <span className="text-[9px] text-gray-500">OBJECTION DEFENSE</span>
                    <span className="text-[9px] text-gray-300">45</span>
                 </div>
                 <div className="flex justify-between items-center group">
                    <span className="text-[9px] text-gray-500">SPEECH CLARITY</span>
                    <span className="text-[9px] text-gray-300">82</span>
                 </div>
                 <div className="flex justify-between items-center group">
                    <span className="text-[9px] text-gray-500">DISCOVERY SCORE</span>
                    <span className="text-[9px] text-white">99</span>
                 </div>
                 <div className="flex justify-between items-center group">
                    <span className="text-[9px] text-gray-500">MAGIC EVASION</span>
                    <span className="text-[9px] text-gray-300">20</span>
                 </div>
              </div>
            </div>

            <div className="ff-panel border-[#333] p-6 flex flex-col relative group">
               <h2 className="text-[10px] text-gray-300 mb-6 flex items-center justify-between border-b border-[#222] pb-4 z-10 w-full">
                   <span className="flex items-center gap-2"><Target className="w-4 h-4 text-gray-500" /> ACTIVE QUESTS</span>
                   <span className="text-[8px] text-gray-500 ml-2">URGENT</span>
               </h2>
               <div className="flex-1 flex flex-col z-10 gap-4">
                  <div className="ff-inset p-4 bg-[#0a0a0a] border border-[#333] hover:border-gray-500 transition-colors">
                     <h3 className="text-[8px] sm:text-[9px] text-white mb-2 leading-loose">FOE DETECTED: GATEKEEPER</h3>
                     <p className="text-[8px] text-gray-500 leading-relaxed mb-6">
                       Speed metrics dropped. Boss units are casting [HANG UP] early.
                     </p>
                     <Link to="/guillotine" className="w-full py-4 bg-white text-black hover:bg-gray-200 text-[8px] text-center flex items-center justify-center gap-2 transition-all rounded-sm uppercase tracking-widest font-bold">
                        <Play className="w-4 h-4" /> BATTLE PREP
                     </Link>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Rail: Leaderboard */}
        <div className="lg:col-span-4 ff-panel p-6 flex flex-col pb-0 relative">

           <div className="flex-1 relative z-10">
             <h2 className="text-[10px] text-gray-300 mb-6 flex items-center justify-between border-b border-[#222] pb-4">
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-500" /> PARTY MEMBERS</span>
            </h2>
            <div className="space-y-4 flex flex-col pt-2">
               {[
                { name: 'SARAH', score: currentElo + 120, role: 'AE', rank: '01' },
                { name: 'MIKE', score: currentElo + 80, role: 'AE', rank: '02' },
                { name: 'ALPHA', score: currentElo, role: 'AE', rank: '03', isMe: true },
              ].map((player, idx) => (
                <div key={idx} className={`flex justify-between items-center p-3 cursor-pointer hover:bg-[#111] transition-colors border border-transparent hover:border-[#333]`}>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-gray-600">{player.rank}</span>
                    <div className="flex flex-col">
                      <span className={`text-[10px] ${player.isMe ? 'text-white' : 'text-gray-300'}`}>{player.name}</span>
                      <span className="text-[8px] text-gray-600 mt-2">{player.role}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className={`text-[10px] ${player.isMe ? 'text-white' : 'text-gray-300'}`}>{player.score}</span>
                     <span className="text-[8px] text-gray-600 mt-2">EXP</span>
                  </div>
                </div>
              ))}
              
              <Link to="/leaderboard" className="mt-8 w-full py-4 hover:bg-[#111] text-gray-400 text-[8px] flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-[#333]">
                 VIEW ALL HALL OF FAME <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="border-t border-[#222] py-6 relative z-10 mt-auto">
            <h2 className="text-[10px] text-gray-300 mb-6 flex items-center gap-2">
              <Award className="w-4 h-4 text-gray-500" /> MAGIC & ITEMS
            </h2>
            {badges.length === 0 ? (
              <p className="text-[8px] text-gray-600 p-6 ff-inset text-center border-[#222]">
                INVENTORY EMPTY.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, i) => (
                  <div key={i} className="ff-inset px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#111] transition-colors border-[#222]">
                    <span className="text-[8px] text-gray-400 pt-1">{badge}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
