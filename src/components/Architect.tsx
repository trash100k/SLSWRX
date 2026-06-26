import React, { useState } from 'react';
import { Layers, Save, Globe, Eye, UserX, BrainCircuit, MessageSquare, AlertTriangle, Play, ShieldAlert, Sparkles, Building, Briefcase, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Architect() {
  const [scenarioName, setScenarioName] = useState('');
  const [persona, setPersona] = useState('');
  const [industry, setIndustry] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [objections, setObjections] = useState('');
  const [twist, setTwist] = useState('');
  const [winCondition, setWinCondition] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAutoGenerate = async () => {
    // Simulate AI filling out the form for you
    setIsGenerating(true);
    setTimeout(() => {
       setScenarioName('The CISO Stonewall');
       setPersona('Grumpy Chief Information Security Officer');
       setIndustry('Fintech / Banking');
       setPainPoints('Recent compliance audit failure, budget slashed by 20%, exhausted from vendors pitching "AI".');
       setObjections('1. "We build everything in-house." 2. "Our data cannot leave our bare-metal servers."');
       setTwist('Mid-call, he gets pinged about an active security incident and tries to hang up.');
       setWinCondition('Keep him on the line for 3 minutes and secure a follow-up technical deep-dive call.');
       setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-black p-2 flex justify-center text-white font-pixel h-full overflow-y-auto leading-relaxed">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-4 h-[calc(100vh-8rem)]">
        
        {/* Sidebar / List */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="ff-panel p-6 shrink-0 relative overflow-hidden shadow-md">
            <span className="text-[8px] text-[#facc15] text-shadow-pixel uppercase mb-4 flex items-center justify-center md:justify-start gap-3 border-b-2 border-white/20 pb-2">
              <Layers className="w-4 h-4" /> WORKSHOP
            </span>
            <h1 className="text-2xl md:text-3xl text-white text-shadow-pixel uppercase mb-4 text-center md:text-left">
              THE ARCHITECT
            </h1>
            <p className="text-[10px] text-gray-300 leading-loose ff-inset p-4 bg-black/50 border-[#facc15]/30">
              FORGE CUSTOM HOSTILE PERSONAS, SPECIFIC INDUSTRY SCENARIOS, AND UNHINGED GATEKEEPERS. TRAIN YOUR TEAM OR PUBLISH TO THE GLOBAL ARCADE.
            </p>
          </div>

          <div className="ff-panel p-6 flex-1 overflow-y-auto shadow-md">
             <div className="flex items-center justify-between mb-6 border-b-2 border-white/20 pb-2">
                <h3 className="text-[10px] text-white text-shadow-pixel uppercase">BLUEPRINTS</h3>
                <span className="text-[8px] px-2 py-1 ff-inset bg-white/10 uppercase">3 / ∞ (PRO)</span>
             </div>
             
             <div className="space-y-4">
                <div className="p-4 ff-inset bg-white/5 border-2 border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] text-white text-shadow-pixel uppercase">THE CISO STONEWALL</span>
                    <span className="text-[8px] bg-[#10b981]/20 text-[#10b981] px-2 py-1 border-2 border-[#10b981]/30 uppercase">PUBLISHED</span>
                  </div>
                  <p className="text-[8px] text-gray-400 uppercase leading-loose">FINTECH • SECURITY • HARD</p>
                </div>
                
                <div className="p-4 ff-inset bg-black border-2 border-gray-700 cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] text-gray-300 uppercase">SAAS BUDGET FREEZE</span>
                    <span className="text-[8px] bg-gray-600/20 text-gray-400 px-2 py-1 border-2 border-gray-600/30 uppercase">DRAFT</span>
                  </div>
                  <p className="text-[8px] text-gray-500 uppercase leading-loose">B2B SAAS • CFO • MEDIUM</p>
                </div>
             </div>
          </div>
        </div>

        {/* Studio Editor */}
        <div className="w-full md:w-2/3 ff-panel flex flex-col h-full overflow-hidden shadow-md">
          
          <div className="p-6 border-b-2 border-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center shrink-0 bg-white/5 gap-4">
             <div className="flex items-center gap-4 w-full sm:w-auto">
               <input 
                 type="text" 
                 placeholder="SCENARIO CODENAME..." 
                 value={scenarioName}
                 onChange={e => setScenarioName(e.target.value)}
                 className="bg-transparent border-none text-[12px] md:text-[14px] text-white text-shadow-pixel uppercase placeholder-gray-600 focus:outline-none w-full sm:w-80 ff-inset p-3"
               />
             </div>
             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
               <button onClick={handleAutoGenerate} disabled={isGenerating} className="px-6 py-4 ff-panel border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 disabled:opacity-50 text-[10px] uppercase transition-colors flex justify-center items-center gap-3">
                 <Sparkles className="w-4 h-4" /> {isGenerating ? 'SYNTHESIZING...' : 'AI ASSIST'}
               </button>
               <button className="ff-panel border-2 border-[#facc15] bg-gradient-to-b from-gray-800 to-gray-900 text-[#facc15] px-6 py-4 text-[10px] uppercase hover:brightness-125 transition-colors flex justify-center items-center gap-3 shadow-md">
                 <Globe className="w-4 h-4" /> PUBLISH
               </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <label className="text-[10px] text-white text-shadow-pixel uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2">
                   <UserX className="w-4 h-4 text-[#facc15]" /> TARGET PERSONA
                 </label>
                 <input 
                   type="text" 
                   value={persona}
                   onChange={e => setPersona(e.target.value)}
                   className="w-full ff-inset bg-black p-4 text-[10px] text-white uppercase focus:outline-none focus:border-[#facc15] focus:bg-white/5 transition-colors" 
                   placeholder="E.G. GRUMPY VP OF SALES"
                 />
               </div>
               <div className="space-y-4">
                 <label className="text-[10px] text-white text-shadow-pixel uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2">
                   <Building className="w-4 h-4 text-[#3b82f6]" /> CONTEXT
                 </label>
                 <input 
                   type="text" 
                   value={industry}
                   onChange={e => setIndustry(e.target.value)}
                   className="w-full ff-inset bg-black p-4 text-[10px] text-white uppercase focus:outline-none focus:border-[#3b82f6] focus:bg-white/5 transition-colors" 
                   placeholder="E.G. LOGISTICS"
                 />
               </div>
             </div>

             <div className="space-y-4">
               <label className="text-[10px] text-white text-shadow-pixel uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2">
                 <Briefcase className="w-4 h-4 text-red-400" /> PAIN POINTS & ENVIRONMENT
               </label>
               <textarea 
                 value={painPoints}
                 onChange={e => setPainPoints(e.target.value)}
                 rows={3}
                 className="w-full ff-inset bg-black p-4 text-[10px] text-white uppercase focus:outline-none focus:border-red-400 focus:bg-white/5 transition-colors resize-y leading-loose h-24" 
                 placeholder="WHAT KEEPS THEM UP AT NIGHT?"
               />
             </div>

             <div className="space-y-4">
               <label className="text-[10px] text-white text-shadow-pixel uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2">
                 <ShieldAlert className="w-4 h-4 text-[#a855f7]" /> PRE-SEEDED OBJECTIONS
               </label>
               <textarea 
                 value={objections}
                 onChange={e => setObjections(e.target.value)}
                 rows={3}
                 className="w-full ff-inset bg-black p-4 text-[10px] text-white uppercase focus:outline-none focus:border-[#a855f7] focus:bg-white/5 transition-colors resize-y leading-loose h-24" 
                 placeholder="LIST MAIN OBJECTIONS..."
               />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <label className="text-[10px] text-white text-shadow-pixel uppercase flex items-center gap-3 border-b-2 border-white/20 pb-2">
                   <Zap className="w-4 h-4 text-[#facc15]" /> THE TWIST (EVENT)
                 </label>
                 <textarea 
                   value={twist}
                   onChange={e => setTwist(e.target.value)}
                   rows={2}
                   className="w-full ff-inset bg-black p-4 text-[10px] text-white uppercase focus:outline-none focus:border-[#facc15] focus:bg-white/5 transition-colors resize-y leading-loose h-20" 
                   placeholder="E.G. SOMEONE KNOCKS..."
                 />
               </div>
               <div className="space-y-4 ff-panel p-4 bg-white/5 shadow-inner">
                 <label className="text-[8px] text-gray-300 uppercase flex items-center gap-3 border-b-2 border-white/10 pb-2 mb-2">
                    VICTORY CONDITION
                 </label>
                 <textarea 
                   value={winCondition}
                   onChange={e => setWinCondition(e.target.value)}
                   rows={2}
                   className="w-full ff-inset bg-black p-4 text-[10px] text-white uppercase focus:outline-none focus:border-[#10b981] focus:bg-[#10b981]/10 transition-colors resize-y leading-loose h-20" 
                   placeholder="WHAT MUST THEY DO TO WIN?"
                 />
               </div>
             </div>

          </div>

          <div className="p-6 border-t-2 border-white/20 bg-black flex flex-col md:flex-row items-center justify-between shrink-0 gap-6">
             <p className="text-[8px] text-gray-500 uppercase">CHANGES UNSAVED.</p>
             <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
               <Link to={`/arena?custom=${encodeURIComponent(scenarioName)}`} className="text-[10px] uppercase ff-panel p-4 bg-white/10 hover:bg-white/20 transition-colors text-white flex justify-center items-center gap-3 w-full sm:w-auto shadow-sm">
                 <Play className="w-4 h-4" /> TEST RUN
               </Link>
               <button className="text-[10px] uppercase ff-panel p-4 bg-gray-900 border-2 border-gray-700 text-gray-400 cursor-not-allowed flex justify-center items-center gap-3 w-full sm:w-auto shadow-sm">
                 <Save className="w-4 h-4" /> SAVE DRAFT
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
