export interface Rank {
  name: string;
  min: number;
  max: number;
  color: string;
}

export const RANKS: Rank[] = [
  { name: 'Bronze', min: 0, max: 999, color: 'text-[#CD7F32]' },
  { name: 'Silver', min: 1000, max: 1499, color: 'text-gray-400' },
  { name: 'Gold', min: 1500, max: 1999, color: 'text-yellow-400' },
  { name: 'Platinum', min: 2000, max: 2499, color: 'text-cyan-400' },
  { name: 'Diamond', min: 2500, max: 2999, color: 'text-blue-500' },
  { name: 'Apex Legend', min: 3000, max: Infinity, color: 'text-amber-500' }
];

export function getRankData(elo: number) {
  const rankInfo = RANKS.find(r => elo >= r.min && elo <= r.max) || RANKS[0];
  const nextRank = RANKS[RANKS.indexOf(rankInfo) + 1] || rankInfo;
  
  let progress = 100;
  let xpNeeded = 0;
  
  if (nextRank !== rankInfo) {
    progress = ((elo - rankInfo.min) / (nextRank.min - rankInfo.min)) * 100;
    xpNeeded = nextRank.min - elo;
  }
  
  return { 
    name: rankInfo.name, 
    color: rankInfo.color,
    progress: Math.min(100, Math.max(0, progress)), 
    xpNeeded 
  };
}

// In-memory or local storage management
export const getStoredElo = () => {
  const elo = localStorage.getItem('salesproof_elo');
  return elo ? parseInt(elo, 10) : 1000; // Start at 1000 (Silver)
};

export const updateElo = (currentElo: number, score: number) => {
  // Win condition usually around 70/100
  const baseDelta = score - 70;
  const change = Math.floor(baseDelta * 2);
  const newElo = Math.max(0, currentElo + change);
  localStorage.setItem('salesproof_elo', newElo.toString());
  return { newElo, change };
};

export const unlockBadge = (badgeName: string) => {
  if (!badgeName) return;
  const stored = localStorage.getItem('salesproof_badges');
  const badges = stored ? JSON.parse(stored) : [];
  if (!badges.includes(badgeName)) {
    badges.push(badgeName);
    localStorage.setItem('salesproof_badges', JSON.stringify(badges));
  }
};

export const getBadges = (): string[] => {
  const stored = localStorage.getItem('salesproof_badges');
  return stored ? JSON.parse(stored) : [];
};
