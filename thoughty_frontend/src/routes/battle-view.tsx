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
import api from '../services/api';
import { toast } from 'react-toastify';

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
    reasoning?: string[];
    keyFactors?: string[];
    confidence?: string;
    voteSummary?: string;
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

  // Load battle data from API
  useEffect(() => {
    const loadBattle = async () => {
      if (!battleId) {
        navigate('/battles');
        return;
      }

      setLoading(true);
      try {
        // Fetch battle details
        const battleRes = await api.get(`/battles/${battleId}/`);
        const battleData = battleRes.data;

        // Fetch the actual pod data since battle only contains IDs
        const [podARes, podBRes, resultsRes] = await Promise.all([
          api.get(`/pods/${battleData.pod_a}/`),
          api.get(`/pods/${battleData.pod_b}/`),
          api.get(`/battles/${battleId}/results/`)
        ]);

        const podA = podARes.data;
        const podB = podBRes.data;
        const voteCounts = resultsRes.data;

        // Transform to UI format
        const battle: Battle = {
          id: battleData.id.toString(),
          podA: {
            id: podA.id.toString(),
            name: podA.title,
            description: podA.content.slice(0, 150) + (podA.content.length > 150 ? '...' : ''),
            icon: 'lightbulb',
            tags: (podA.tags || []).map((tag: any) => typeof tag === 'string' ? tag : tag.name),
            author: podA.user?.username || 'Unknown',
            createdAt: formatDate(podA.created_at),
            battleCount: 0
          },
          podB: {
            id: podB.id.toString(),
            name: podB.title,
            description: podB.content.slice(0, 150) + (podB.content.length > 150 ? '...' : ''),
            icon: 'lightbulb',
            tags: (podB.tags || []).map((tag: any) => typeof tag === 'string' ? tag : tag.name),
            author: podB.user?.username || 'Unknown',
            createdAt: formatDate(podB.created_at),
            battleCount: 0
          },
          votesA: voteCounts[battleData.pod_a] || 0,
          votesB: voteCounts[battleData.pod_b] || 0,
          startedAt: formatDate(battleData.created_at),
          status: battleData.winner ? 'completed' : 'active'
        };

        setCurrentBattle(battle);
        setShowResults(battle.votesA + battle.votesB > 0);
        
      } catch (error) {
        console.error('Error loading battle:', error);
        toast.error('Failed to load battle');
        navigate('/battles');
      } finally {
        setLoading(false);
      }
    };

    loadBattle();
  }, [battleId, navigate]);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

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

  // Voting function
  const vote = useCallback(async (side: 'A' | 'B') => {
    if (!currentBattle || userHasVoted) return;

    try {
      const choiceId = side === 'A' ? currentBattle.podA.id : currentBattle.podB.id;
      
      await api.post('/vote/', {
        battle: parseInt(battleId!),
        choice: parseInt(choiceId)
      });

      // Update UI state
      const updatedBattle = {
        ...currentBattle,
        votesA: side === 'A' ? currentBattle.votesA + 1 : currentBattle.votesA,
        votesB: side === 'B' ? currentBattle.votesB + 1 : currentBattle.votesB
      };

      setCurrentBattle(updatedBattle);
      setUserHasVoted(true);
      setShowResults(true);
      
      toast.success('Vote cast successfully!');
    } catch (error) {
      console.error('Failed to vote:', error);
      toast.error('Failed to cast vote');
    }
  }, [currentBattle, userHasVoted, battleId]);

  const letAIDecide = useCallback(async () => {
    if (!currentBattle || userHasVoted) return;

    try {
      const verdictRes = await api.get(`/battles/${battleId}/ai-verdict/`);
      const verdictData = verdictRes.data;

      // Handle AI verdict - even if it's a tie
      const winnerIsA = verdictData.winner_pod && verdictData.winner_pod.toString() === currentBattle.podA.id;
      const winnerIsB = verdictData.winner_pod && verdictData.winner_pod.toString() === currentBattle.podB.id;
      const isTie = !verdictData.winner_pod || verdictData.winner_title === 'Tie';
      
      const updatedBattle: Battle = {
        ...currentBattle,
        votesA: winnerIsA ? currentBattle.votesA + 3 : (isTie ? currentBattle.votesA + 1 : currentBattle.votesA),
        votesB: winnerIsB ? currentBattle.votesB + 3 : (isTie ? currentBattle.votesB + 1 : currentBattle.votesB),
        status: 'completed',
        aiVerdict: {
          winner: verdictData.winner_title || 'Tie',
          verdict: verdictData.analysis || 'AI analysis completed.',
          reasoning: verdictData.reasoning || [],
          keyFactors: verdictData.key_factors || [],
          confidence: verdictData.ai_confidence || 'medium',
          voteSummary: verdictData.vote_summary || ''
        }
      };

      setCurrentBattle(updatedBattle);
      setUserHasVoted(true);
      setShowResults(true);
      setShowAIVerdict(true);

      toast.success('AI verdict generated!');
    } catch (error) {
      console.error('Failed to get AI verdict:', error);
      toast.error('Failed to get AI verdict');
    }
  }, [currentBattle, userHasVoted, battleId]);

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
                  <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faRobot} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">AI Judge Verdict</h3>
                        {currentBattle.aiVerdict.confidence && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            currentBattle.aiVerdict.confidence === 'high' ? 'bg-green-100 text-green-700' :
                            currentBattle.aiVerdict.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {currentBattle.aiVerdict.confidence} confidence
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Winner Announcement */}
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <p className="mb-3 text-gray-700">After analyzing both ThoughtPods, the verdict is:</p>
                      <div className="flex items-center justify-center mb-3">
                        <div className={`px-4 py-2 rounded-full text-white font-bold flex items-center ${
                          currentBattle.aiVerdict.winner === 'Tie' 
                            ? 'bg-gradient-to-r from-gray-500 to-gray-600' 
                            : 'bg-gradient-to-r from-indigo-500 to-pink-500'
                        }`}>
                          <FontAwesomeIcon icon={currentBattle.aiVerdict.winner === 'Tie' ? faRobot : faTrophy} className="mr-2" />
                          <span>{currentBattle.aiVerdict.winner}</span>
                        </div>
                      </div>
                      {currentBattle.aiVerdict.voteSummary && (
                        <p className="text-sm text-gray-500 text-center">{currentBattle.aiVerdict.voteSummary}</p>
                      )}
                    </div>

                    {/* Analysis */}
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <h4 className="font-semibold mb-2 text-gray-800">Analysis</h4>
                      <p className="text-sm text-gray-700">{currentBattle.aiVerdict.verdict}</p>
                    </div>

                    {/* Key Factors */}
                    {currentBattle.aiVerdict.keyFactors && currentBattle.aiVerdict.keyFactors.length > 0 && (
                      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <h4 className="font-semibold mb-2 text-gray-800">Key Evaluation Factors</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentBattle.aiVerdict.keyFactors.map((factor, index) => (
                            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Detailed Reasoning */}
                    {currentBattle.aiVerdict.reasoning && currentBattle.aiVerdict.reasoning.length > 0 && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold mb-3 text-gray-800">Detailed Reasoning</h4>
                        <div className="space-y-2">
                          {currentBattle.aiVerdict.reasoning.map((reason, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </div>
                              <p className="text-sm text-gray-700">{reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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