import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Crosshair, Search, PhoneForwarded, Brain, Volume2, Target, AlertTriangle, ArrowRight, Flame, Award, TrendingUp, TrendingDown, Mail, Send, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { BOSSES } from '../data/bosses';
import { getStoredElo, updateElo, unlockBadge } from '../lib/game';

interface GradeResult {
  overallScore: number;
  roast: string;
  methodologyDetected?: string;
  metrics: {
    pattern_interrupt: { score: number; comment: string };
    active_listening: { score: number; comment: string };
    discovery_spin: { score: number; comment: string };
    pain_funnel: { score: number; comment: string };
    objection_isolation: { score: number; comment: string };
    frame_control: { score: number; comment: string };
    value_prop: { score: number; comment: string };
    micro_commitments: { score: number; comment: string };
    closing_urgency: { score: number; comment: string };
    tonality_mirroring: { score: number; comment: string };
  };
  keyMoments?: {
    quote: string;
    analysis: string;
  }[];
}

export default function PostCall() {
  const location = useLocation();
  const navigate = useNavigate();
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [eloResult, setEloResult] = useState<{ newElo: number, change: number } | null>(null);
  const [badgeUnlocked, setBadgeUnlocked] = useState<string | null>(null);

  const [followupText, setFollowupText] = useState('');
  const [isEvaluatingFollowup, setIsEvaluatingFollowup] = useState(false);
  const [followupResult, setFollowupResult] = useState<any>(null);

  const handleEvalFollowup = async () => {
     if (!followupText.trim() || isEvaluatingFollowup) return;
     setIsEvaluatingFollowup(true);
     try {
       const res = await fetch('/api/roast-email', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ emailText: followupText })
       });
       const data = await res.json();
       const parsed = JSON.parse(data.result.replace(/```json/g, '').replace(/```/g, '').trim());
       
       setFollowupResult({
           score: parsed.score,
           isGood: parsed.score >= 70,
           feedback: parsed.roast
       });
     } catch (e) {
         console.error(e);
     } finally {
         setIsEvaluatingFollowup(false);
     }
  };

  useEffect(() => {
    if (!location.state?.transcript) {
      navigate('/');
      return;
    }

    const runGrade = async () => {
      try {
        const bossId = location.state.bossId || 'greg';
        const boss = BOSSES[bossId] || BOSSES['greg'];
        const prompt = `Challenge: ${boss.title}\nWin Condition: ${boss.winCondition}\nTwist: ${boss.twist}\nSystem Prompt used by target: ${boss.systemPrompt}`;

        const transcriptStr = JSON.stringify(location.state.transcript, null, 2);

        const res = await fetch('/api/grade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, transcript: transcriptStr })
        });
        const data = await res.json();
        const parsed = JSON.parse(data.result.replace(/```json/g, '').replace(/```/g, '').trim());
        setGrade(parsed);

        // Process ELO & Badges
        const currentElo = getStoredElo();
        const eloUpdates = updateElo(currentElo, parsed.overallScore);
        setEloResult(eloUpdates);

        if (parsed.overallScore >= 80) {
          unlockBadge(boss.badgeReward);
          setBadgeUnlocked(boss.badgeReward);
        }

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    runGrade();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black text-white font-pixel p-8 border-none h-full">
        <div className="relative flex items-center justify-center w-32 h-32 mb-8 drop-shadow-xl">
           <div className="absolute inset-0 border-[6px] border-[#facc15]/20"></div>
           <div className="absolute inset-0 border-[6px] border-[#facc15] border-t-transparent animate-spin"></div>
           <Flame className="w-12 h-12 text-[#facc15] animate-pulse drop-shadow-md" />
        </div>
        <h2 className="text-xl md:text-2xl text-white text-shadow-pixel uppercase mb-6">ANALYZING BATTLE...</h2>
        <p className="text-[10px] text-gray-300 uppercase leading-loose ff-inset p-4">CALCULATING EXP GAINS AND CRITICAL HITS.</p>
      </div>
    );
  }

  if (!grade) return <div className="text-center text-red-500 font-pixel text-[12px] mt-10">ERROR EVALUATING BATTLE LOG.</div>;

  const scoreColor = grade.overallScore >= 80 ? 'text-[#10b981]' : grade.overallScore >= 60 ? 'text-[#facc15]' : 'text-red-500';

  const metricsArray = [
    { key: 'pattern_interrupt', icon: PhoneForwarded, label: 'Pattern Interrupt', data: grade.metrics.pattern_interrupt },
    { key: 'discovery_spin', icon: Search, label: 'SPIN Discovery', data: grade.metrics.discovery_spin },
    { key: 'pain_funnel', icon: Target, label: 'Pain Funnel', data: grade.metrics.pain_funnel },
    { key: 'objection_isolation', icon: ShieldAlert, label: 'Obj. Isolation', data: grade.metrics.objection_isolation },
    { key: 'frame_control', icon: Brain, label: 'Frame Control', data: grade.metrics.frame_control },
    { key: 'value_prop', icon: Crosshair, label: 'Value Prop', data: grade.metrics.value_prop },
    { key: 'micro_commitments', icon: ArrowRight, label: 'Tie-Downs', data: grade.metrics.micro_commitments },
    { key: 'closing_urgency', icon: AlertTriangle, label: 'Closing Urgency', data: grade.metrics.closing_urgency },
    { key: 'tonality_mirroring', icon: Volume2, label: 'Tonality Match', data: grade.metrics.tonality_mirroring },
    { key: 'active_listening', icon: Flame, label: 'Active Listening', data: grade.metrics.active_listening }
  ];

  return (
    <div className="flex-1 p-2 bg-black flex justify-center text-white font-pixel h-full overflow-y-auto leading-relaxed">
      <div className="w-full max-w-5xl flex flex-col gap-4 h-fit">
        
        {/* Top Header Section */}
        <div className="ff-panel p-8 relative overflow-hidden flex flex-col items-center text-center shrink-0 shadow-md">
            
            <div className="relative z-10 w-full max-w-3xl">
              <span className="text-[10px] text-[#facc15] text-shadow-pixel uppercase mb-4 block border-b-2 border-white/20 pb-4">BATTLE TERMINATED // SPOILS OF WAR</span>
              
              <div className="flex flex-col items-center mt-8 mb-10">
                 <motion.div 
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="relative flex items-center justify-center"
                 >
                   <svg className="w-48 h-48 transform -rotate-90 drop-shadow-xl">
                     <circle className="text-black border-2 border-white/20" strokeWidth="12" stroke="currentColor" fill="transparent" r="80" cx="96" cy="96" />
                     <motion.circle 
                       className={scoreColor} 
                       strokeWidth="12" 
                       strokeDasharray={80 * 2 * Math.PI} 
                       initial={{ strokeDashoffset: 80 * 2 * Math.PI }}
                       animate={{ strokeDashoffset: (80 * 2 * Math.PI) - ((grade.overallScore / 100) * (80 * 2 * Math.PI)) }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       strokeLinecap="square" 
                       stroke="currentColor" 
                       fill="transparent" 
                       r="80" cx="96" cy="96" 
                     />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center ff-inset bg-black/50 mx-4 my-4 rounded-full">
                     <span className={`text-4xl md:text-5xl text-shadow-pixel ${scoreColor}`}>{grade.overallScore}</span>
                     <span className="text-[8px] text-gray-300 uppercase mt-2">/ 100</span>
                   </div>
                 </motion.div>
              </div>

              {/* Roast Box */}
              <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="w-full ff-panel-red p-8 relative overflow-hidden text-left mb-6"
              >
                <h3 className="text-[10px] text-[#facc15] text-shadow-pixel mb-4 uppercase flex items-center gap-2 border-b-2 border-white/20 pb-2">
                  <Flame className="w-5 h-5 text-red-500" /> SAGE CRITIQUE
                </h3>
                <p className="text-[10px] leading-loose text-white mb-6 pt-2">
                  "{grade.roast}"
                </p>

                {grade.methodologyDetected && (
                   <div className="mt-6 ff-inset p-4 flex items-start gap-4">
                      <Brain className="w-6 h-6 text-[#facc15] shrink-0 mt-1" />
                      <div>
                         <span className="text-[10px] uppercase text-[#facc15] text-shadow-pixel block mb-2">CLASS DETECTED</span>
                         <span className="text-[8px] text-white leading-loose">{grade.methodologyDetected}</span>
                      </div>
                   </div>
                )}
              </motion.div>

              {/* Badges & ELO Panel */}
              <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.7 }}
                 className="w-full flex flex-col sm:flex-row gap-4"
              >
                 {eloResult && (
                   <div className={`flex-1 ff-panel p-6 flex items-center gap-6 ${eloResult.change >= 0 ? '' : 'ff-panel-red'}`}>
                      {eloResult.change >= 0 ? <TrendingUp className="w-8 h-8 text-[#10b981]" /> : <TrendingDown className="w-8 h-8 text-red-500" />}
                      <div className="flex flex-col text-left">
                         <span className="text-[8px] uppercase text-gray-300 mb-2">EXP EARNED</span>
                         <span className={`text-2xl text-shadow-pixel ${eloResult.change >= 0 ? 'text-[#10b981]' : 'text-red-500'}`}>
                           {eloResult.change >= 0 ? '+' : ''}{eloResult.change}
                         </span>
                      </div>
                      <div className="ml-auto flex flex-col items-end text-right border-l-2 border-white/20 pl-6">
                         <span className="text-[8px] uppercase text-gray-300 mb-2">TOTAL EXP</span>
                         <span className="text-xl text-white text-shadow-pixel">{eloResult.newElo}</span>
                      </div>
                   </div>
                 )}

                 {badgeUnlocked && (
                   <div className="flex-1 ff-panel p-6 flex items-center gap-6">
                      <div className="w-12 h-12 ff-inset flex items-center justify-center">
                        <Award className="w-6 h-6 text-[#facc15]" />
                      </div>
                      <div className="flex flex-col text-left">
                         <span className="text-[8px] text-[#facc15] text-shadow-pixel uppercase mb-2">TROPHY LOOTED!</span>
                         <span className="text-sm text-white text-shadow-pixel uppercase">{badgeUnlocked}</span>
                      </div>
                   </div>
                 )}
              </motion.div>
            </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 shrink-0 mb-4">
          {metricsArray.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + (i * 0.05) }}
              key={item.key} 
              className="ff-panel p-4 flex flex-col hover:brightness-110 transition-all"
            >
               <div className="flex justify-between items-start mb-4">
                 <div className="flex flex-col w-full">
                   <span className="text-[8px] text-white uppercase text-shadow-pixel mb-3 flex items-center gap-2"><item.icon className="w-4 h-4 text-[#facc15]" /> {item.label}</span>
                   <span className={`text-[12px] text-shadow-pixel text-right w-full ${item.data?.score >= 8 ? 'text-[#10b981]' : item.data?.score >= 5 ? 'text-[#facc15]' : 'text-red-400'}`}>
                     {item.data?.score || 0} <span className="text-[8px] text-white/50">/ 10</span>
                   </span>
                 </div>
               </div>
               
               <div className="h-2 w-full ff-inset relative mb-4">
                 <div className={`h-full absolute left-0 top-0 transition-all duration-1000 ${item.data?.score >= 8 ? 'bg-[#10b981]' : item.data?.score >= 5 ? 'bg-[#facc15]' : 'bg-red-500'}`} style={{ width: `${(item.data?.score || 0) * 10}%` }}></div>
               </div>
               
               <p className="text-[8px] text-gray-300 leading-loose mt-auto ff-inset p-3 bg-white/5">{item.data?.comment || "No data"}</p>
            </motion.div>
          ))}
        </div>

        {/* Key Moments */}
        {grade.keyMoments && grade.keyMoments.length > 0 && (
          <div className="ff-panel p-8 mb-4 shrink-0 flex flex-col">
             <h3 className="text-[10px] text-white text-shadow-pixel mb-6 uppercase flex items-center gap-2 border-b-2 border-white/20 pb-2">
                <Target className="w-5 h-5 text-[#facc15]" /> BATTLE LOG ANALYSIS
             </h3>
             <div className="space-y-6">
               {grade.keyMoments.map((moment, idx) => (
                 <div key={idx} className="flex flex-col md:flex-row gap-6 ff-inset p-6 bg-white/5">
                    <div className="md:w-1/3 border-b-2 md:border-b-0 md:border-r-2 border-white/20 pb-4 md:pb-0 md:pr-4">
                       <span className="text-[8px] text-[#facc15] uppercase text-shadow-pixel mb-3 block">ENEMY MOVE</span>
                       <span className="text-[10px] text-white leading-loose">"{moment.quote}"</span>
                    </div>
                    <div className="md:w-2/3 md:pl-2">
                       <span className="text-[8px] text-[#3b82f6] uppercase text-shadow-pixel mb-3 block">TACTICAL REVIEW</span>
                       <span className="text-[8px] text-gray-200 leading-loose block ff-inset p-4">{moment.analysis}</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Follow Up Section */}
        <div className="ff-panel p-8 mb-4 shrink-0 flex flex-col relative overflow-hidden">
             
             <h3 className="text-[10px] text-white text-shadow-pixel mb-6 uppercase flex items-center gap-2 border-b-2 border-white/20 pb-2">
                <Mail className="w-5 h-5 text-[#3b82f6]" /> CAST INVENTORY MSG (FOLLOW UP)
             </h3>
             <p className="text-[8px] text-gray-300 mb-6 leading-loose">DRAFT A MISSIVE TO THE FOE. WE WILL GAUGE ITS POTENCY.</p>
             <textarea 
               value={followupText}
               onChange={e => setFollowupText(e.target.value)}
               disabled={isEvaluatingFollowup || !!followupResult}
               className="w-full h-40 ff-inset p-6 text-[10px] text-white focus:outline-none focus:border-[#facc15] focus:bg-white/10 transition-colors mb-6 disabled:opacity-50 resize-y"
               placeholder="GREETINGS DAVE, A FINE DUEL TODAY..."
             />
             <button 
                onClick={handleEvalFollowup}
                disabled={!followupText.trim() || isEvaluatingFollowup || !!followupResult}
                className="w-full sm:w-auto self-end ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-gray-400 text-white text-[10px] py-4 px-8 hover:brightness-125 uppercase transition-colors flex items-center justify-center gap-3 shadow-md disabled:opacity-50"
             >
                {isEvaluatingFollowup ? <><span className="w-4 h-4 border-4 border-white border-t-transparent rounded-full animate-spin"></span> CASTING...</> : <><Send className="w-4 h-4" /> SEND MISSIVE</>}
             </button>

             {followupResult && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border-t-2 border-white/20 pt-8 flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center justify-center px-8 border-b-2 md:border-b-0 md:border-r-2 border-white/20 pb-6 md:pb-0">
                        <span className="text-[8px] text-gray-300 uppercase mb-3">MISSIVE POWER</span>
                        <span className={`text-4xl text-shadow-pixel ${followupResult.isGood ? 'text-[#10b981]' : 'text-red-500'}`}>{followupResult.score}<span className="text-sm text-gray-500">/10</span></span>
                    </div>
                    <div className="flex flex-col flex-1 pb-4">
                        <span className="text-[8px] text-[#facc15] text-shadow-pixel uppercase mb-4">SAGE FEEDBACK</span>
                        <p className="text-[10px] text-white leading-loose ff-inset p-6 bg-white/5">"{followupResult.feedback}"</p>
                    </div>
                 </motion.div>
             )}
        </div>

        <div className="flex justify-center ff-panel p-8 mb-12 shrink-0">
           <Link to="/" className="w-full sm:w-auto ff-panel bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-[#facc15] text-white font-pixel text-[10px] py-5 px-12 hover:brightness-125 uppercase text-center transition-all shadow-md text-shadow-pixel">
              RETURN TO WORLD MAP
           </Link>
        </div>

      </div>
    </div>
  );
}
