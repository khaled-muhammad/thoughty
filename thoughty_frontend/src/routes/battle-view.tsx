import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/battles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLightbulb,
  faHome,
  faTree,
  faMountain,
  faRobot,
  faUsers,
  faThumbsUp,
  faComment,
  faArrowLeft,
  faBolt,
  faBrain,
  faChartLine,
  faCity,
  faBriefcase,
  faShareAlt,
  faEllipsisH,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';

// Types (shared with battles.tsx - these should be moved to a shared types file)
interface ThoughtPod {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  author: string;
  createdAt: string;
  battleCount: number;
  winCount?: number;
  lossCount?: number;
  drawCount?: number;
}

interface Battle {
  id: string;
  podA: ThoughtPod;
  podB: ThoughtPod;
  votesA: number;
  votesB: number;
  startedAt: string;
  status: 'active' | 'completed';
  aiVerdict?: {
    winner: string;
    verdict: string;
  };
}

// Sample data (in real app, this would come from API)
const samplePods: ThoughtPod[] = [
  {
    id: '1',
    name: 'Digital Nomadism',
    description: 'Exploring the benefits and challenges of location-independent work and lifestyle in the digital age.',
    icon: 'lightbulb',
    tags: ['Lifestyle', 'Work', 'Technology'],
    author: 'You',
    createdAt: '2 days ago',
    battleCount: 3
  },
  {
    id: '2',
    name: 'Consciousness Theory',
    description: 'Examining different theories of consciousness and their implications for AI and human cognition.',
    icon: 'brain',
    tags: ['Philosophy', 'Science', 'AI'],
    author: 'You',
    createdAt: '1 week ago',
    battleCount: 5
  },
  {
    id: '3',
    name: 'Future of Capitalism',
    description: 'Analyzing potential evolutionary paths for capitalist systems in the face of technological disruption.',
    icon: 'chart-line',
    tags: ['Economics', 'Future', 'Society'],
    author: 'You',
    createdAt: '3 days ago',
    battleCount: 2
  }
];

const sampleOpponentPods: ThoughtPod[] = [
  {
    id: '4',
    name: 'Stable Careers',
    description: 'The value of traditional career paths and stable employment in an era of gig economies and rapid change.',
    icon: 'home',
    tags: ['Career', 'Stability', 'Society'],
    author: 'ThoughtLeader',
    createdAt: '1 week ago',
    battleCount: 7,
    winCount: 4,
    lossCount: 2,
    drawCount: 1
  },
  {
    id: '5',
    name: 'Urban Living',
    description: 'Why cities continue to be hubs of innovation, culture, and economic opportunity despite their challenges.',
    icon: 'city',
    tags: ['Cities', 'Community', 'Innovation'],
    author: 'CityThinker',
    createdAt: '2 weeks ago',
    battleCount: 12,
    winCount: 8,
    lossCount: 3,
    drawCount: 1
  },
  {
    id: '6',
    name: 'Corporate Careers',
    description: 'The evolving role of traditional corporate careers in personal development and societal contribution.',
    icon: 'briefcase',
    tags: ['Business', 'Career', 'Growth'],
    author: 'CareerGuru',
    createdAt: '5 days ago',
    battleCount: 9,
    winCount: 5,
    lossCount: 3,
    drawCount: 1
  },
  {
    id: '7',
    name: 'Community Roots',
    description: 'The importance of deep community connections and local roots in personal fulfillment and societal health.',
    icon: 'users',
    tags: ['Community', 'Belonging', 'Society'],
    author: 'SocialThinker',
    createdAt: '1 week ago',
    battleCount: 6,
    winCount: 3,
    lossCount: 2,
    drawCount: 1
  }
];

const sampleRecentBattles: Battle[] = [
  {
    id: '1',
    podA: samplePods[0],
    podB: sampleOpponentPods[0],
    votesA: 24,
    votesB: 13,
    startedAt: '2 hours ago',
    status: 'completed'
  },
  {
    id: '2',
    podA: samplePods[1],
    podB: sampleOpponentPods[1],
    votesA: 42,
    votesB: 46,
    startedAt: '5 hours ago',
    status: 'completed'
  },
  {
    id: '3',
    podA: samplePods[2],
    podB: sampleOpponentPods[2],
    votesA: 37,
    votesB: 29,
    startedAt: '1 day ago',
    status: 'completed'
  }
];

export default function BattleView() {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  
  // Battle state
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAIVerdict, setShowAIVerdict] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load battle data on mount
  useEffect(() => {
    const loadBattle = async () => {
      setLoading(true);
      try {
        // Load battles from localStorage or use sample data
        let allBattles: Battle[] = sampleRecentBattles;
        try {
          const savedBattles = localStorage.getItem('thoughty_battles');
          if (savedBattles) {
            allBattles = JSON.parse(savedBattles);
          }
        } catch (error) {
          console.error('Error loading battles from localStorage:', error);
        }

        const battle = allBattles.find(b => b.id === battleId);
        if (battle) {
          setCurrentBattle(battle);
          setUserHasVoted(battle.status === 'completed');
          setShowResults(battle.status === 'completed');
          setShowAIVerdict(battle.status === 'completed' && !!battle.aiVerdict);
        } else {
          // Battle not found, redirect to battles page
          navigate('/battles');
        }
      } catch (error) {
        console.error('Error loading battle:', error);
        navigate('/battles');
      } finally {
        setLoading(false);
      }
    };

    if (battleId) {
      loadBattle();
    } else {
      navigate('/battles');
    }
  }, [battleId, navigate]);

  // Helper function to update battle in localStorage
  const updateBattleInStorage = useCallback((updatedBattle: Battle) => {
    try {
      const savedBattles = localStorage.getItem('thoughty_battles');
      let allBattles: Battle[] = sampleRecentBattles;
      if (savedBattles) {
        allBattles = JSON.parse(savedBattles);
      }
      
      // Update the specific battle
      const battleIndex = allBattles.findIndex(b => b.id === updatedBattle.id);
      if (battleIndex !== -1) {
        allBattles[battleIndex] = updatedBattle;
        localStorage.setItem('thoughty_battles', JSON.stringify(allBattles));
      }
    } catch (error) {
      console.error('Error updating battle in localStorage:', error);
    }
  }, []);

  // Voting functions
  const vote = useCallback((side: 'A' | 'B') => {
    if (!currentBattle || userHasVoted) return;

    const updatedBattle = {
      ...currentBattle,
      votesA: side === 'A' ? currentBattle.votesA + 1 : currentBattle.votesA,
      votesB: side === 'B' ? currentBattle.votesB + 1 : currentBattle.votesB
    };

    setCurrentBattle(updatedBattle);
    setUserHasVoted(true);
    setShowResults(true);
    
    // Update battle in localStorage
    updateBattleInStorage(updatedBattle);

    // Here you would make an API call to save the vote
    console.log('Vote cast for side:', side);
  }, [currentBattle, userHasVoted, updateBattleInStorage]);

  const letAIDecide = useCallback(() => {
    if (!currentBattle || userHasVoted) return;

    // AI logic
    const totalVotes = currentBattle.votesA + currentBattle.votesB;
    const randomFactor = Math.random();
    let aiChoice: 'A' | 'B';

    if (totalVotes > 0) {
      const percentageA = currentBattle.votesA / totalVotes;
      aiChoice = randomFactor < percentageA + 0.1 ? 'A' : 'B';
    } else {
      aiChoice = randomFactor < 0.55 ? 'A' : 'B';
    }

    const updatedBattle: Battle = {
      ...currentBattle,
      votesA: aiChoice === 'A' ? currentBattle.votesA + 3 : currentBattle.votesA,
      votesB: aiChoice === 'B' ? currentBattle.votesB + 3 : currentBattle.votesB,
      status: 'completed'
    };

    // Generate AI verdict
    const winner = aiChoice === 'A' ? currentBattle.podA.name : currentBattle.podB.name;
    const loser = aiChoice === 'A' ? currentBattle.podB.name : currentBattle.podA.name;
    
    let verdict: string;
    if (aiChoice === 'A') {
      verdict = `"While ${loser.toLowerCase()} offers valuable perspectives, ${winner.toLowerCase()} demonstrates superior adaptability and innovation potential. The dynamic nature of this approach aligns better with emerging trends and future-oriented thinking that will drive progress in our rapidly evolving world."`;
    } else {
      verdict = `"While ${loser.toLowerCase()} presents interesting ideas, ${winner.toLowerCase()} provides more sustainable and practical solutions. The foundational stability and proven track record of this approach offers greater long-term value and societal benefit."`;
    }

    updatedBattle.aiVerdict = { winner, verdict };

    setCurrentBattle(updatedBattle);
    setUserHasVoted(true);
    setShowResults(true);
    setShowAIVerdict(true);

    // Update battle in localStorage
    updateBattleInStorage(updatedBattle);

    // Here you would make an API call to save the AI decision
    console.log('AI decided for side:', aiChoice);
  }, [currentBattle, userHasVoted, updateBattleInStorage]);

  // Helper functions
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: typeof faLightbulb } = {
      'lightbulb': faLightbulb,
      'brain': faBrain,
      'chart-line': faChartLine,
      'home': faHome,
      'city': faCity,
      'briefcase': faBriefcase,
      'users': faUsers,
      'tree': faTree,
      'mountain': faMountain,
      'robot': faRobot
    };
    return iconMap[iconName] || faLightbulb;
  };

  const calculatePercentages = (votesA: number, votesB: number) => {
    const total = votesA + votesB;
    if (total === 0) return { percentageA: 0, percentageB: 0 };
    
    const percentageA = Math.round((votesA / total) * 100);
    const percentageB = 100 - percentageA;
    
    return { percentageA, percentageB };
  };

  const goBackToBattles = () => {
    navigate('/battles');
  };

  if (loading) {
    return (
      <div id="battle" className="page pt-[3rem]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading battle...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBattle) {
    return (
      <div id="battle" className="page pt-[3rem]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Battle not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="battle" className="page pt-[3rem]">
      <section className="container mx-auto px-4 py-8 mb-12">
        <div className="flex items-center mb-6">
          <button 
            onClick={goBackToBattles}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
          <h1 className="title-font text-3xl font-bold gradient-text">Mind Battle</h1>
        </div>

        <div className="rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Battle Header */}
          <div className="border-b p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faBolt} />
              </div>
              <span className="font-medium">{currentBattle.status === 'active' ? 'Active Battle' : 'Completed Battle'}</span>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon icon={faShareAlt} />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon icon={faEllipsisH} />
              </button>
            </div>
          </div>

          {/* Battle Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Pod A */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-100 mx-auto mb-4 flex items-center justify-center text-indigo-600 text-2xl">
                  <FontAwesomeIcon icon={getIconComponent(currentBattle.podA.icon)} />
                </div>
                <h3 className="font-bold text-xl mb-2">{currentBattle.podA.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{currentBattle.podA.description}</p>
                <div className="flex justify-center space-x-2 mb-4">
                  {currentBattle.podA.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => vote('A')}
                  disabled={userHasVoted}
                  className={`vote-btn px-6 py-3 rounded-full font-medium transition w-full max-w-xs ${
                    userHasVoted 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Vote for This Pod
                </button>
              </div>

              {/* VS Separator */}
              <div className="hidden md:flex items-center justify-center vs-separator">
                <div className="relative w-full max-w-xs">
                  {/* Animated background glow */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-50 vs-glow"></div>
                  </div>
                  {/* Pulsing dots */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full sparkle-1"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full sparkle-2"></div>
                  {/* Main VS badge */}
                  <div className="relative flex justify-center">
                    <div className="relative group">
                      {/* Outer glow ring */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300 vs-glow"></div>
                      {/* Main VS container */}
                      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-xl border-2 border-white/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        <span className="text-xl font-bold tracking-wider drop-shadow-lg filter">VS</span>
                        {/* Inner shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 rounded-full opacity-40"></div>
                      </div>
                      {/* Sparkle effects */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full sparkle-1 shadow-lg"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full sparkle-2 shadow-lg"></div>
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-pink-400 rounded-full animation-delay-400 animate-ping"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pod B */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center text-green-600 text-2xl">
                  <FontAwesomeIcon icon={getIconComponent(currentBattle.podB.icon)} />
                </div>
                <h3 className="font-bold text-xl mb-2">{currentBattle.podB.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{currentBattle.podB.description}</p>
                <div className="flex justify-center space-x-2 mb-4">
                  {currentBattle.podB.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => vote('B')}
                  disabled={userHasVoted}
                  className={`vote-btn px-6 py-3 rounded-full font-medium transition w-full max-w-xs ${
                    userHasVoted 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Vote for This Pod
                </button>
              </div>
            </div>

            {/* AI Decision Option */}
            {!userHasVoted && (
              <div className="text-center mb-8">
                <button 
                  onClick={letAIDecide}
                  className="bg-gray-800 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-900 transition inline-flex items-center"
                >
                  <FontAwesomeIcon icon={faRobot} className="mr-2" />
                  Let AI Decide
                </button>
              </div>
            )}

            {/* Voting Results */}
            {showResults && (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>{currentBattle.podA.name}</span>
                    <span>{currentBattle.podB.name}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 flex">
                    <div 
                      className="bg-indigo-600 h-4 rounded-l-full transition-all duration-500" 
                      style={{width: `${calculatePercentages(currentBattle.votesA, currentBattle.votesB).percentageA}%`}}
                    ></div>
                    <div 
                      className="bg-green-600 h-4 rounded-r-full transition-all duration-500" 
                      style={{width: `${calculatePercentages(currentBattle.votesA, currentBattle.votesB).percentageB}%`}}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs p-3 text-gray-500 mt-1">
                    <span>
                      {currentBattle.votesA} vote{currentBattle.votesA !== 1 ? 's' : ''} 
                      ({calculatePercentages(currentBattle.votesA, currentBattle.votesB).percentageA}%)
                    </span>
                    <span>
                      {currentBattle.votesB} vote{currentBattle.votesB !== 1 ? 's' : ''} 
                      ({calculatePercentages(currentBattle.votesA, currentBattle.votesB).percentageB}%)
                    </span>
                  </div>
                </div>

                {/* AI Verdict */}
                {showAIVerdict && currentBattle.aiVerdict && (
                  <div className="mt-8 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faRobot} />
                      </div>
                      <h3 className="font-bold">AI Judge Verdict</h3>
                    </div>
                    <div className="rounded-lg p-4 shadow-sm">
                      <p className="mb-3">After analyzing both ThoughtPods, I declare the winner to be:</p>
                      <div className="flex items-center justify-center mb-3">
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold flex items-center">
                          <FontAwesomeIcon icon={faTrophy} className="mr-2" />
                          <span>{currentBattle.aiVerdict.winner}</span>
                        </div>
                      </div>
                      <p className="text-sm">{currentBattle.aiVerdict.verdict}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Battle Footer */}
          <div className="border-t p-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="text-gray-500 hover:text-indigo-600 flex items-center">
                <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                <span>{currentBattle.votesA + currentBattle.votesB}</span>
              </button>
              <button className="text-gray-500 hover:text-indigo-600 flex items-center">
                <FontAwesomeIcon icon={faComment} className="mr-1" />
                <span>5</span>
              </button>
            </div>
            <div>
              <span className="text-sm text-gray-500">Started {currentBattle.startedAt}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}