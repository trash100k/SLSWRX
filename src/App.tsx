import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Target, Swords, Gamepad2, TrendingUp, BookOpen, LayoutDashboard, User, Building, Shield, Film, Trophy } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Arena from './components/Arena';
import PostCall from './components/PostCall';
import Gauntlet from './components/Gauntlet';
import Leaderboard from './components/Leaderboard';
import TrainingGrounds from './components/TrainingGrounds';
import RankedHub from './components/RankedHub';
import Arcade from './components/Arcade';
import Profile from './components/Profile';
import TeamHub from './components/TeamHub';
import Architect from './components/Architect';
import Guillotine from './components/Guillotine';
import RapidFire from './components/RapidFire';
import Negotiation from './components/Negotiation';
import Armory from './components/Armory';
import FilmRoom from './components/FilmRoom';
import Tournaments from './components/Tournaments';

import WarRoom from './components/WarRoom';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-[var(--color-forged-iron)] text-[var(--color-fog-white)] font-sans flex flex-col relative z-0">
      <div className="ember-overlay"></div>
      <header className="h-20 ff-panel m-0 border-x-0 border-t-0 flex items-center justify-between px-6 lg:px-12 shrink-0 z-50 relative">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex flex-col gap-1 transition-colors group">
            <span className="font-heading text-2xl lg:text-3xl font-bold tracking-wider text-white group-hover:text-[var(--color-fog-white)]">
              SalesWorx
            </span>
            <span className="text-[10px] tracking-widest text-[var(--color-ash)] uppercase flex items-center gap-1">
              powered by <span className="forge-text font-heading text-[12px] font-bold">GAELWORX</span>
            </span>
          </Link>
          <div className="text-[10px] md:text-[11px] text-[var(--color-ash)] flex gap-6 overflow-x-auto scrollbar-hide py-2 items-center md:ml-12 font-bold tracking-widest uppercase">
             <Link to="/" className={`transition-all whitespace-nowrap flex items-center gap-2 ${currentPath === '/' ? 'text-[var(--color-fog-white)]' : 'hover:text-[var(--color-fog-white)]'}`}>DASHBOARD</Link>
             <Link to="/arcade" className={`transition-all whitespace-nowrap flex items-center gap-2 ${currentPath.startsWith('/arcade') || currentPath === '/gauntlet' ? 'text-[var(--color-fog-white)]' : 'hover:text-[var(--color-fog-white)]'}`}>ARCADE</Link>
             <Link to="/ranked" className={`transition-all whitespace-nowrap flex items-center gap-2 ${currentPath.startsWith('/ranked') || currentPath === '/arena' ? 'text-[var(--color-fog-white)]' : 'hover:text-[var(--color-fog-white)]'}`}>RANKED</Link>
             <Link to="/war" className={`transition-all whitespace-nowrap flex items-center gap-2 ${currentPath.startsWith('/war') ? 'text-[var(--color-celtic-blood)]' : 'text-[var(--color-celtic-blood)] opacity-80 hover:opacity-100'}`}>WAR ROOM</Link>
             <Link to="/armory" className={`transition-all whitespace-nowrap flex items-center gap-2 ${currentPath === '/armory' ? 'text-[var(--color-fog-white)]' : 'hover:text-[var(--color-fog-white)]'}`}>ARMORY</Link>
             <Link to="/film-room" className={`transition-all whitespace-nowrap flex items-center gap-2 ${currentPath === '/film-room' ? 'text-[var(--color-fog-white)]' : 'hover:text-[var(--color-fog-white)]'}`}>TAPE</Link>
             <Link to="/tournaments" className={`transition-all whitespace-nowrap flex items-center gap-2 ${currentPath === '/tournaments' ? 'text-[var(--color-fog-white)]' : 'hover:text-[var(--color-fog-white)]'}`}>EVENTS</Link>
             <Link to="/training" className={`transition-all whitespace-nowrap flex items-center gap-2 ${currentPath === '/training' ? 'text-[var(--color-fog-white)]' : 'hover:text-[var(--color-fog-white)]'}`}>TRAINING</Link>
             <Link to="/leaderboard" className={`transition-all whitespace-nowrap flex items-center gap-2 ${currentPath === '/leaderboard' ? 'text-[var(--color-fog-white)]' : 'hover:text-[var(--color-fog-white)]'}`}>STANDINGS</Link>
             <Link to="/team" className={`transition-all whitespace-nowrap flex items-center gap-2 ${currentPath === '/team' ? 'text-[var(--color-fog-white)]' : 'hover:text-[var(--color-fog-white)]'}`}>ENTERPRISE</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-[var(--color-ash)] uppercase tracking-widest hidden lg:block">CLEARANCE</span>
             <span className="text-sm font-bold text-[var(--color-fog-white)] uppercase hidden sm:block">L-99</span>
          </div>
          <Link to="/profile" className={`flex items-center justify-center p-2 border border-[var(--color-ash)] hover:bg-[var(--color-celtic-blood)] hover:border-[var(--color-celtic-blood)] hover:text-white transition-all ${currentPath === '/profile' ? 'bg-[var(--color-celtic-blood)] border-[var(--color-celtic-blood)] text-white' : 'text-[var(--color-ash)]'}`}>
            <User className="w-4 h-4" />
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col p-6 overflow-hidden relative z-10 w-full max-w-[1600px] mx-auto animate-forge-reveal">
        {children}
      </main>
      <footer className="py-4 border-t border-[rgba(241,242,246,0.05)] px-6 lg:px-12 flex items-center justify-between shrink-0 relative bg-[rgba(31,40,51,0.2)] backdrop-blur-md z-50">
        <div className="text-[10px] text-[var(--color-ash)] truncate flex gap-8 tracking-widest uppercase font-bold">
          <span>SYSTEM: ONLINE</span>
          <span>SESSIONS: 42,400</span>
        </div>
        <div className="text-[10px] text-[var(--color-ember-glow)] tracking-widest uppercase font-bold truncate flex items-center gap-2">
          <span>AWAITING EXECUTION</span>
          <span className="w-2 h-2 bg-[var(--color-ember-glow)] animate-pulse rounded-full"></span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutContent>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/arcade" element={<Arcade />} />
          <Route path="/ranked" element={<RankedHub />} />
          <Route path="/war" element={<WarRoom />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/post-call" element={<PostCall />} />
          <Route path="/gauntlet" element={<Gauntlet />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/training" element={<TrainingGrounds />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/team" element={<TeamHub />} />
          <Route path="/architect" element={<Architect />} />
          <Route path="/guillotine" element={<Guillotine />} />
          <Route path="/rapid-fire" element={<RapidFire />} />
          <Route path="/negotiation" element={<Negotiation />} />
          <Route path="/armory" element={<Armory />} />
          <Route path="/film-room" element={<FilmRoom />} />
          <Route path="/tournaments" element={<Tournaments />} />
        </Routes>
      </LayoutContent>
    </BrowserRouter>
  );
}
