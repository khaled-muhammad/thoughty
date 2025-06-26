import { useState, useEffect, useCallback } from 'react';
import '../styles/gamify.css';
import api from '../services/api';

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

interface UserStats {
  tokens: number;
  badges: number;
  rank: number;
}

// Badge types with corresponding colors
const badgeTypes = {
  starter: { gradient: "from-indigo-500 to-purple-500", glow: "glow-indigo" },
  consistent: { gradient: "from-teal-500 to-emerald-500", glow: "glow-teal" },
  explorer: { gradient: "from-blue-500 to-cyan-500", glow: "glow" },
  master: { gradient: "from-purple-500 to-pink-500", glow: "glow-accent" },
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
  const [userStats, setUserStats] = useState<UserStats>({ tokens: 0, badges: 0, rank: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [badgesResponse, leaderboardResponse, statsResponse] = await Promise.all([
          api.get('/gamification/badges/'),
          api.get('/gamification/leaderboard/'),
          api.get('/gamification/stats/')
        ]);

        setBadges(badgesResponse.data);
        setLeaderboard(leaderboardResponse.data);
        setUserStats(statsResponse.data);
      } catch (err) {
        console.error('Error fetching gamification data:', err);
        setError('Failed to load gamification data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  // Error state
  if (error) {
    return (
      <div id="gamify" className="page">
        <main className="pt-[5rem]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-400 text-lg mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-primary hover:bg-primary-light px-6 py-3 rounded-lg transition-all"
                >
                  Retry
                </button>
              </div>
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
                    {userStats.tokens.toLocaleString()}
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
                const isCurrentUser = user.rank === userStats.rank;
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
                        {isCurrentUser ? "You" : user.username}
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
                <h3 className={`text-2xl font-bold mb-2 transition-all duration-300 delay-100 ${
                  isModalOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                } ${selectedBadge.unlocked ? 'text-white' : 'text-gray-300'}`}>
                  {selectedBadge.name}
                </h3>
                
                {/* Animated description */}
                <p className={`text-gray-300 text-center mb-4 transition-all duration-300 delay-200 ${
                  isModalOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {selectedBadge.description}
                </p>
                
                {/* Requirements section with enhanced styling */}
                <div className={`w-full bg-dark/30 rounded-lg p-4 border border-gray-700 transition-all duration-300 delay-300 ${
                  isModalOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <h4 className="text-sm font-semibold text-primary-light mb-2 flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                      />
                    </svg>
                    Requirements
                  </h4>
                  <p className="text-sm text-gray-400">{selectedBadge.requirements}</p>
                  
                  {/* Progress bar for locked badges */}
                  {!selectedBadge.unlocked && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{selectedBadge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${badgeTypes[selectedBadge.type]?.gradient || badgeTypes.starter.gradient} h-2 rounded-full transition-all duration-500`} 
                          style={{ width: `${selectedBadge.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Achievement status */}
                  <div className={`mt-3 flex items-center ${selectedBadge.unlocked ? 'text-green-400' : 'text-gray-400'}`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      {selectedBadge.unlocked ? (
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      ) : (
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      )}
                    </svg>
                    <span className="text-sm font-medium">
                      {selectedBadge.unlocked ? 'Unlocked!' : 'In Progress'}
                    </span>
                  </div>
                </div>
            </div>
          </div>
          </div>
          )}
      </main>
    </div>
  );
}
