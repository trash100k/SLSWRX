import { Link } from 'react-router-dom';
import { Play, TrendingUp, Skull, Shield, Flame, Award, Gamepad2 } from 'lucide-react';
import { getDailyBoss } from '../data/bosses';
import { useState } from 'react';

export default function Arcade() {
  const dailyBoss = getDailyBoss();
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCustom = async () => {
    if (!customTopic.trim() || isGenerating) return;
    setIsGenerating(true);
    // Simulate generation then ride to arena
    setTimeout(() => {
      window.location.href = `/arena?custom=${encodeURIComponent(customTopic)}`;
    }, 2000);
  };

  return (
    <div className="flex-1 bg-black p-2 flex justify-center text-white font-pixel h-full overflow-y-auto leading-relaxed">
      <div className="max-w-6xl w-full flex flex-col gap-8">
        
        {/* Header */}
        <div className="ff-panel p-8 text-center shrink-0">
          <span className="text-[10px] text-gray-400 mb-4 flex justify-center items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-gray-500" /> CASUAL PLAY // NO EXP LOSS
          </span>
          <h1 className="text-2xl md:text-4xl text-white uppercase mb-4">
            THE ARCADE
          </h1>
          <p className="text-[10px] text-gray-500 max-w-2xl mx-auto leading-loose">
            TEST NEW STRATEGIES, WARM UP WITH THE DAILY BOSS, OR FACE ENDLESS WAVES. NO PRESSURE, JUST PRACTICE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
           
           {/* Daily Boss */}
           <div className="ff-panel p-6 flex flex-col lg:col-span-1">
             <h2 className="text-[10px] text-gray-300 mb-6 flex items-center gap-2 border-b border-[#222] pb-4">
                 <Skull className="w-4 h-4 text-gray-500" /> DAILY BOSS
             </h2>
             {dailyBoss && (
               <div className="flex-1 bg-[#0a0a0a] border border-[#222] p-6 flex flex-col relative group cursor-pointer hover:border-gray-500 transition-colors">
                 <div className="absolute top-4 right-4 text-[8px] text-gray-500 px-1">{dailyBoss.difficulty}</div>
                 <h3 className="text-[12px] text-gray-200 mb-4 uppercase">{dailyBoss.name}</h3>
                 <p className="text-[8px] text-gray-400 mb-6">{dailyBoss.title}</p>
                 <p className="text-[8px] text-gray-500 mb-8 leading-loose flex-1">{dailyBoss.description} <br/><br/><span className="text-gray-400">TWIST: {dailyBoss.twist}</span></p>
                 <Link to={`/arena?boss=${dailyBoss.id}`} className="text-center w-full py-4 bg-white text-black hover:bg-gray-200 text-[8px] uppercase transition-colors tracking-widest font-bold">
                   BATTLE
                 </Link>
               </div>
             )}
           </div>

           {/* Other Modes */}
           <div className="lg:col-span-2 flex flex-col gap-6">
               
               {/* Custom Drill */}
               <div className="bg-[#0a0a0a] border border-[#927503] p-8 flex flex-col flex-1 relative overflow-hidden group rounded-lg">
                 <h2 className="text-[10px] text-gray-300 mb-6 flex items-center justify-between border-b border-[#222] pb-4">
                     <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#927503]" /> THE ARCHITECT</span>
                 </h2>
                 <div className="flex-1 border border-[#222] bg-[#050505] p-6 flex flex-col md:flex-row gap-8 items-center hover:bg-[#111] transition-colors rounded">
                   <div className="flex-1 text-center md:text-left z-10">
                     <h3 className="text-[12px] text-gray-200 uppercase mb-4">DESIGN YOUR CRUCIBLE</h3>
                     <p className="text-[8px] text-gray-500 mb-8 leading-loose max-w-sm mx-auto md:mx-0">BUILD HIGHLY SPECIFIC SCENARIOS. INJECT EXTREME OBJECTIONS. TEST YOUR EXACT ICP BEFORE YOU DIAL THEM IN REALITY.</p>
                     <Link to="/architect" className="inline-block py-4 px-8 border border-[#927503] hover:bg-[#927503] hover:text-black text-[#927503] text-[10px] uppercase transition-colors rounded-sm tracking-widest">
                        ENTER STUDIO
                     </Link>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                  
                  {/* Guillotine Mode */}
                  <div className="bg-[#0a0a0a] border border-[#7f1d1d] p-6 flex flex-col transition-all flex-1 rounded-lg">
                     <h3 className="text-[10px] text-gray-300 uppercase mb-6 pt-2 border-b border-[#222] pb-4">THE GUILLOTINE</h3>
                     <p className="text-[8px] text-gray-500 mb-6 leading-loose flex-1">PERFECT YOUR OPENING. TIME TOLERANCE SHRINKS EVERY ROUND. DON'T STUTTER OR THE CALL IS DEAD.</p>
                     <Link to="/guillotine" className="w-full py-4 border border-[#7f1d1d] text-red-500 hover:bg-[#7f1d1d] hover:text-white text-[8px] uppercase text-center mt-auto transition-colors rounded-sm tracking-widest">
                        FACE THE BLOCK
                     </Link>
                  </div>

                  {/* Rapid Fire */}
                  <div className="bg-[#0a0a0a] border border-[#222] p-6 flex flex-col transition-all flex-1 rounded-lg hover:border-yellow-500/50">
                     <h3 className="text-[10px] text-gray-300 uppercase mb-6 pt-2 border-b border-[#222] pb-4">RAPID FIRE</h3>
                     <p className="text-[8px] text-gray-500 mb-6 leading-loose flex-1">DEFEND AGAINST A BARRAGE OF OBJECTIONS. VOICE-ONLY RESPONSES. SURVIVE THE ONSLAUGHT.</p>
                     <Link to="/rapid-fire" className="w-full py-4 border border-[#222] text-gray-400 hover:border-yellow-500 hover:text-yellow-500 text-[8px] uppercase text-center mt-auto transition-colors rounded-sm tracking-widest">
                        ENTER ONSLAUGHT
                     </Link>
                  </div>

                  {/* Negotiation */}
                  <div className="bg-[#0a0a0a] border border-[#222] p-6 flex flex-col transition-all flex-1 rounded-lg hover:border-green-500/50">
                     <h3 className="text-[10px] text-gray-300 uppercase mb-6 pt-2 border-b border-[#222] pb-4">THE REDLINE</h3>
                     <p className="text-[8px] text-gray-500 mb-6 leading-loose flex-1">LATE STAGE DEAL. PROCUREMENT WANTS BLOOD. PROTECT ARR AT ALL COSTS.</p>
                     <Link to="/negotiation" className="w-full py-4 border border-[#222] text-gray-400 hover:border-green-500 hover:text-green-500 text-[8px] uppercase text-center mt-auto transition-colors rounded-sm tracking-widest">
                        DEFEND ACV
                     </Link>
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
