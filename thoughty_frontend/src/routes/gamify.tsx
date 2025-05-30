import { useState, useEffect, useCallback } from 'react';
import '../styles/gamify.css';

// TypeScript interfaces
interface Badge {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  requirements: string;
  icon: string;
  type: keyof typeof badgeTypes;
  progress: number;
  customGradient?: string;
}

interface LeaderboardUser {
  username: string;
  tokens: number;
  rank: number;
}

// Badge types with corresponding colors
const badgeTypes = {
  starter: { gradient: "from-indigo-500 to-purple-500", glow: "glow-indigo" },
  consistent: { gradient: "from-teal-500 to-emerald-500", glow: "glow-teal" },
  explorer: { gradient: "from-blue-500 to-cyan-500", glow: "glow" },
  master: { gradient: "from-purple-500 to-pink-500", glow: "glow-accent" },
  routine: { gradient: "from-amber-500 to-yellow-500", glow: "glow-amber" },
  streak: { gradient: "from-orange-500 to-red-500", glow: "glow-accent" },
  achievement: { gradient: "from-fuchsia-500 to-purple-500", glow: "glow" },
  dedication: { gradient: "from-violet-500 to-indigo-500", glow: "glow-indigo" },
  community: { gradient: "from-green-500 to-teal-500", glow: "glow-secondary" },
  legendary: { gradient: "from-rose-500 to-pink-500", glow: "glow-accent" },
} as const;

export default function Gamify() {
  // State management
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [userTokens] = useState(1250);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const initializeMockData = () => {
      // Mock badges data
      const mockBadges: Badge[] = [
        {
          id: 1,
          name: "Starter",
          description: "Completed your first session",
          unlocked: true,
          requirements: "Complete 1 meditation session",
          icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
          type: "starter",
          progress: 100,
        },
        {
          id: 2,
          name: "Consistent",
          description: "3 days in a row",
          unlocked: true,
          requirements: "Meditate for 3 consecutive days",
          icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
          type: "consistent",
          progress: 100,
        },
        {
          id: 3,
          name: "Explorer",
          description: "Tried all categories",
          unlocked: true,
          requirements: "Try at least 1 session from each category",
          icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
          type: "explorer",
          progress: 100,
        },
        {
          id: 4,
          name: "Zen Master",
          description: "30 minutes straight",
          unlocked: false,
          requirements: "Complete a 30-minute meditation session",
          icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
          type: "master",
          progress: 65,
        },
        {
          id: 5,
          name: "Early Bird",
          description: "Morning routine",
          unlocked: true,
          requirements: "Complete 5 morning sessions before 8 AM",
          icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
          type: "routine",
          progress: 100,
        },
        {
          id: 6,
          name: "Night Owl",
          description: "Evening routine",
          unlocked: true,
          requirements: "Complete 5 evening sessions after 8 PM",
          icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
          type: "routine",
          progress: 100,
          customGradient: "from-red-500 to-pink-500",
        },
        {
          id: 7,
          name: "Streak",
          description: "7 day streak",
          unlocked: false,
          requirements: "Meditate for 7 consecutive days",
          icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
          type: "streak",
          progress: 42,
        },
        {
          id: 8,
          name: "Centurion",
          description: "100 sessions",
          unlocked: false,
          requirements: "Complete 100 meditation sessions",
          icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
          type: "achievement",
          progress: 28,
        },
        {
          id: 9,
          name: "Dedicated",
          description: "50 hours total",
          unlocked: false,
          requirements: "Reach 50 hours of total meditation time",
          icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          type: "dedication",
          progress: 15,
        },
        {
          id: 10,
          name: "All-Rounder",
          description: "All categories mastered",
          unlocked: false,
          requirements: "Complete 10 sessions in each category",
          icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
          type: "achievement",
          progress: 5,
        },
        {
          id: 11,
          name: "Community",
          description: "Shared with friends",
          unlocked: false,
          requirements: "Invite 3 friends to join Mind Mentor",
          icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          type: "community",
          progress: 33,
        },
        {
          id: 12,
          name: "Legend",
          description: "All badges unlocked",
          unlocked: false,
          requirements: "Earn all other badges in the collection",
          icon: "M12 15l8-8m0 0h-8m8 0v8m-8-8l-8-8m8 8H4m8 8v8",
          type: "legendary",
          progress: 41,
        },
      ];

      // Mock leaderboard data
      const mockLeaderboard: LeaderboardUser[] = [
        { username: "MeditationMaster", tokens: 3250, rank: 1 },
        { username: "ZenGuru", tokens: 2875, rank: 2 },
        { username: "MindfulExplorer", tokens: 2650, rank: 3 },
        { username: "SerenitySeeker", tokens: 2400, rank: 4 },
        { username: "PeacefulWarrior", tokens: 2250, rank: 5 },
        { username: "CalmSoul", tokens: 2100, rank: 6 },
        { username: "TranquilMind", tokens: 1950, rank: 7 },
        { username: "You", tokens: 1250, rank: 8 },
        { username: "Beginner123", tokens: 950, rank: 9 },
        { username: "Newbie", tokens: 500, rank: 10 },
      ];

      setBadges(mockBadges);
      setLeaderboard(mockLeaderboard);
      setIsLoading(false);
    };

    // Simulate API loading delay
    setTimeout(initializeMockData, 500);
  }, []);

  // Event handlers
  const handleBadgeClick = useCallback((badge: Badge) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBadge(null), 200);
  }, []);

  const handleSort = useCallback((order: 'asc' | 'desc') => {
    setSortOrder(order);
    const sorted = [...leaderboard].sort((a, b) => 
      order === 'asc' ? a.tokens - b.tokens : b.tokens - a.tokens
    );
    setLeaderboard(sorted);
  }, [leaderboard]);

  const handleRedeemRewards = useCallback(() => {
    // Implementation for redeeming rewards
    console.log('Opening reward redemption interface...');
  }, []);

  // Computed values
  const unlockedBadgesCount = badges.filter(badge => badge.unlocked).length;
  const totalBadgesCount = badges.length;

  // Loading state
  if (isLoading) {
    return (
      <div id="gamify" className="page">
        <main className="pt-[5rem]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div id="gamify" className="page">
      <main className="pt-[5rem]">
        <div className="container mx-auto px-4 py-8">
          {/* Token Wallet */}
          <div className="card-bg rounded-xl p-6 mb-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-primary-light">
              Your Token Wallet
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center token-animation">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Tokens</p>
                  <p className="text-3xl font-bold">
                    {userTokens.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="progress-bar w-3/4"></div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleRedeemRewards}
                className="input-bg hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white px-6 py-3 rounded-lg font-medium transition-all group"
              >
                <span className="group-hover:text-white">Redeem Rewards</span>
              </button>
            </div>
          </div>

          {/* Badge Collection */}
          <div className="card-bg rounded-xl p-6 mb-8 border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-primary-light">
                Badge Collection
              </h2>
              <div className="text-sm bg-gradient-to-r from-primary/20 to-accent/20 px-3 py-1 rounded-full">
                <span className="text-secondary-light">{unlockedBadgesCount}/{totalBadgesCount}</span> badges
                unlocked
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {badges.map((badge) => {
                const badgeType = badgeTypes[badge.type] || badgeTypes.starter;
                const gradientClass = badge.customGradient
                  ? `bg-gradient-to-br ${badge.customGradient}`
                  : badge.unlocked
                  ? `bg-gradient-to-br ${badgeType.gradient}`
                  : "bg-gradient-to-br from-gray-700 to-gray-800";

                return (
                  <div
                    key={badge.id}
                    onClick={() => handleBadgeClick(badge)}
                    className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all ${
                      badge.unlocked ? `badge-unlocked hover:${badgeType.glow}` : "badge-locked"
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full ${gradientClass} flex items-center justify-center shadow-lg`}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-8 w-8 ${badge.unlocked ? "text-white" : "text-gray-500"}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d={badge.icon} 
                        />
                      </svg>
                    </div>
                    <p className={`mt-2 text-sm font-medium ${badge.unlocked ? "text-white" : "text-gray-400"}`}>
                      {badge.name}
                    </p>
                    {!badge.unlocked && (
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                        <div 
                          className={`bg-gradient-to-r ${badgeType.gradient} h-1.5 rounded-full`} 
                          style={{ width: `${badge.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card-bg rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-primary-light">
                Leaderboard
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSort('asc')}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    sortOrder === 'asc' 
                      ? 'bg-secondary text-white' 
                      : 'input-bg hover:bg-secondary hover:text-white'
                  }`}
                >
                  Low to High
                </button>
                <button
                  onClick={() => handleSort('desc')}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    sortOrder === 'desc' 
                      ? 'bg-accent text-white' 
                      : 'input-bg hover:bg-accent hover:text-white'
                  }`}
                >
                  High to Low
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {leaderboard.map((user) => {
                const isCurrentUser = user.username === "You";
                let rankClass = "";
                let rankColor = "";

                if (user.rank === 1) {
                  rankClass = "rank-1 border border-amber-400/30";
                  rankColor = "text-amber-400";
                } else if (user.rank === 2) {
                  rankClass = "rank-2 border border-gray-400/30";
                  rankColor = "text-gray-300";
                } else if (user.rank === 3) {
                  rankClass = "rank-3 border border-amber-700/30";
                  rankColor = "text-amber-600";
                }

                return (
                  <div
                    key={`${user.username}-${user.rank}`}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/50"
                        : rankClass || "input-bg"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${rankColor || "text-gray-400"} font-bold`}>
                        {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : user.rank}
                      </div>
                      <p className={isCurrentUser ? "font-bold text-primary-light" : ""}>
                        {user.username}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 ${
                          user.rank === 1 ? "text-amber-400" :
                          user.rank === 2 ? "text-gray-300" :
                          user.rank === 3 ? "text-amber-600" :
                          "text-indigo-400"
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      <span className={
                        user.rank === 1 ? "text-amber-400" :
                        user.rank === 2 ? "text-gray-300" :
                        user.rank === 3 ? "text-amber-600" :
                        ""
                      }>
                        {user.tokens.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badge Modal */}
        {isModalOpen && selectedBadge && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-out ${
              isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={handleCloseModal}
          >
            {/* Enhanced backdrop with subtle opacity instead of black */}
            <div className={`absolute inset-0 backdrop-blur-sm transition-all duration-300 ease-out ${
              isModalOpen ? 'bg-black/40' : 'bg-black/0'
            }`}></div>
            
            {/* Modal content with enhanced animations */}
            <div 
              className={`card-bg rounded-xl p-6 max-w-md w-full mx-4 relative z-10 border border-gray-700 transition-all duration-300 ease-out transform ${
                isModalOpen 
                  ? 'scale-100 opacity-100 translate-y-0 rotate-0' 
                  : 'scale-95 opacity-0 translate-y-4 -rotate-1'
              } shadow-2xl shadow-primary/20`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: isModalOpen ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.3s ease-in'
              }}
            >
              {/* Close button with enhanced hover effects */}
            <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 hover:rotate-90 z-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
              
            <div className="flex flex-col items-center">
                {/* Animated badge with enhanced effects */}
                <div className={`w-24 h-24 mb-4 transition-all duration-500 ease-out ${
                  isModalOpen ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                }`}>
                  {(() => {
                    const badgeType = badgeTypes[selectedBadge.type] || badgeTypes.starter;
                    const gradientClass = selectedBadge.customGradient
                      ? `bg-gradient-to-br ${selectedBadge.customGradient}`
                      : selectedBadge.unlocked
                      ? `bg-gradient-to-br ${badgeType.gradient}`
                      : "bg-gradient-to-br from-gray-700 to-gray-800";

                    return (
                      <div className={`w-full h-full rounded-full ${gradientClass} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                        selectedBadge.unlocked ? 'animate-pulse-slow' : ''
                      }`}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-12 w-12 transition-all duration-300 ${
                            selectedBadge.unlocked ? "text-white" : "text-gray-400"
                          } ${isModalOpen ? 'scale-100' : 'scale-0'}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d={selectedBadge.icon} 
                          />
                        </svg>
                        
                        {/* Sparkle effects for unlocked badges */}
                        {selectedBadge.unlocked && (
                          <>
                            <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-ping opacity-75"></div>
                            <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white rounded-full animate-ping animation-delay-200 opacity-60"></div>
                            <div className="absolute top-4 left-2 w-0.5 h-0.5 bg-white rounded-full animate-ping animation-delay-400 opacity-80"></div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
                
                {/* Animated title */}
                <h3 className={`text-xl font-bold mb-2 transition-all duration-400 ease-out ${
                  selectedBadge.unlocked
                    ? `text-transparent bg-clip-text bg-gradient-to-r ${
                        selectedBadge.customGradient || badgeTypes[selectedBadge.type].gradient
                      }`
                    : "text-gray-300"
                } ${isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                  {selectedBadge.name}
                </h3>
                
                {/* Animated description */}
                <p className={`text-center mb-4 transition-all duration-500 ease-out ${
                  selectedBadge.unlocked ? "text-primary-light" : "text-gray-400"
                } ${isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
                  {selectedBadge.description}
                </p>
                
                {/* Animated requirements section */}
                <div className={`w-full bg-dark rounded-lg p-4 border border-gray-700 transition-all duration-600 ease-out ${
                  isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                } hover:border-primary/30`}>
                  <p className={`text-sm font-medium mb-1 transition-colors duration-200 ${
                    selectedBadge.unlocked ? "text-teal-300" : "text-gray-300"
                  }`}>
                    Requirements:
                  </p>
                  <p className={`text-sm transition-colors duration-200 ${
                    selectedBadge.unlocked ? "text-gray-200" : "text-gray-400"
                  }`}>
                    {selectedBadge.requirements}
                  </p>
                  {selectedBadge.unlocked ? (
                    <p className="mt-2 text-sm text-green-400 font-medium transition-all duration-300 animate-fade-in">
                      ✓ You have earned this badge!
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 text-sm text-yellow-400 font-medium transition-all duration-300">
                        Keep going to unlock this badge!
                      </p>
                      <div className={`mt-3 transition-all duration-700 ease-out ${
                        isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                      }`}>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span className="transition-all duration-300">{selectedBadge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r ${badgeTypes[selectedBadge.type].gradient} h-2 rounded-full transition-all duration-1000 ease-out transform ${
                              isModalOpen ? 'translate-x-0' : '-translate-x-full'
                            }`} 
                            style={{ 
                              width: `${selectedBadge.progress}%`,
                              transitionDelay: isModalOpen ? '0.3s' : '0s'
                            }}
              ></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
