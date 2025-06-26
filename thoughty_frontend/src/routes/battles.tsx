import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/battles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faUser,
  faLightbulb,
  faHome,
  faTree,
  faMountain,
  faRobot,
  faUsers,
  faThumbsUp,
  faComment,
  faArrowLeft,
  faSearch,
  faCalendar,
  faBolt,
  faBrain,
  faChartLine,
  faCity,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import { toast } from 'react-toastify';

// Types
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

type ScreenType = 'dashboard' | 'selectPod' | 'selectOpponent';

// Icons for pods (fallback if backend doesn't provide)
const ICON_MAPPING: { [key: string]: string } = {
  'Technology': 'robot',
  'Philosophy': 'brain',
  'Economics': 'chart-line',
  'Lifestyle': 'lightbulb',
  'Business': 'briefcase',
  'Community': 'users',
  'default': 'lightbulb'
};

export default function Battles() {
  const navigate = useNavigate();
  
  // Screen state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  
  // Battle state - removed unused battle state variables
  const [selectedPod, setSelectedPod] = useState<ThoughtPod | null>(null);
  
  // Data state
  const [userPods, setUserPods] = useState<ThoughtPod[]>([]);
  const [opponentPods, setOpponentPods] = useState<ThoughtPod[]>([]);
  const [recentBattles, setRecentBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter state
  const [podSearchTerm, setPodSearchTerm] = useState('');
  const [opponentSearchTerm, setOpponentSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('All Topics');
  const [sortFilter, setSortFilter] = useState('Sort By');

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's pods
        const userPodsRes = await api.get('/pods/mine/');
        const userPodsData = userPodsRes.data || [];
        
        // Fetch all public pods for opponents
        const allPodsRes = await api.get('/pods/');
        const allPodsData = allPodsRes.data || [];
        
        // Fetch recent battles
        const battlesRes = await api.get('/battles/');
        const battlesData = battlesRes.data || [];

        // Transform pods data
        const transformedUserPods = userPodsData.map((pod: any) => ({
          id: pod.id.toString(),
          name: pod.title,
          description: pod.content.slice(0, 150) + (pod.content.length > 150 ? '...' : ''),
          icon: getIconFromTags(pod.tags),
          tags: (pod.tags || []).map((tag: any) => typeof tag === 'string' ? tag : tag.name),
          author: 'You',
          createdAt: formatDate(pod.created_at),
          battleCount: 0 // TODO: add battle count from backend
        }));

        const transformedOpponentPods = allPodsData
          .filter((pod: any) => pod.is_public && !userPodsData.find((up: any) => up.id === pod.id))
          .map((pod: any) => ({
            id: pod.id.toString(),
            name: pod.title,
            description: pod.content.slice(0, 150) + (pod.content.length > 150 ? '...' : ''),
            icon: getIconFromTags(pod.tags),
            tags: (pod.tags || []).map((tag: any) => typeof tag === 'string' ? tag : tag.name),
            author: pod.user?.username || 'Anonymous',
            createdAt: formatDate(pod.created_at),
            battleCount: 0,
            winCount: 0,
            lossCount: 0,
            drawCount: 0
          }));

        // Transform battles data - need to find pod details from the pods we already fetched
        const allPods = [...userPodsData, ...allPodsData];
        const transformedBattles = battlesData
          .map((battle: any) => {
            const podA = allPods.find(p => p.id === battle.pod_a);
            const podB = allPods.find(p => p.id === battle.pod_b);
            
            // Skip battles where we can't find the pods
            if (!podA || !podB) return null;
            
            return {
              id: battle.id.toString(),
              podA: transformPodForBattle(podA),
              podB: transformPodForBattle(podB),
              votesA: 0, // TODO: fetch vote counts
              votesB: 0,
              startedAt: formatDate(battle.created_at),
              status: battle.winner ? 'completed' as const : 'active' as const
            };
          })
          .filter(Boolean); // Remove null entries

        setUserPods(transformedUserPods);
        setOpponentPods(transformedOpponentPods);
        setRecentBattles(transformedBattles);
        
      } catch (error) {
        console.error('Failed to load battles data:', error);
        toast.error('Failed to load battles data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Navigation functions
  const showScreen = useCallback((screen: ScreenType) => {
    setCurrentScreen(screen);
  }, []);

  const startNewBattle = useCallback(() => {
    setSelectedPod(null);
    // Reset search terms when starting new battle
    setPodSearchTerm('');
    setOpponentSearchTerm('');
    setTopicFilter('All Topics');
    setSortFilter('Sort By');
    showScreen('selectPod');
  }, [showScreen]);

  const selectPod = useCallback((pod: ThoughtPod) => {
    setSelectedPod(pod);
    // Reset opponent search when selecting new pod
    setOpponentSearchTerm('');
    setTopicFilter('All Topics');
    setSortFilter('Sort By');
    showScreen('selectOpponent');
  }, [showScreen]);

  const selectOpponent = useCallback(async (opponent: ThoughtPod) => {
    if (!selectedPod) return;

    try {
      // Create battle via API
      const battlePayload = {
        pod_a: parseInt(selectedPod.id),
        pod_b: parseInt(opponent.id),
        vote_threshold: 3
      };

      const response = await api.post('/battles/', battlePayload);
      const newBattle = response.data;

      toast.success('Battle created successfully!');

      // Add to local state
      const battleForUI: Battle = {
        id: newBattle.id.toString(),
        podA: selectedPod,
        podB: opponent,
        votesA: 0,
        votesB: 0,
        startedAt: 'just now',
        status: 'active'
      };
      
      setRecentBattles(prev => [battleForUI, ...prev.slice(0, 4)]);
      
      // Navigate to the battle view route
      navigate(`/battles/${newBattle.id}`);
    } catch (error) {
      console.error('Failed to create battle:', error);
      toast.error('Failed to create battle');
    }
  }, [selectedPod, navigate]);

  const viewExistingBattle = useCallback((battle: Battle) => {
    // Navigate to the dedicated battle view route
    navigate(`/battles/${battle.id}`);
  }, [navigate]);

  // Navigation helper functions
  const goBackToDashboard = useCallback(() => {
    setSelectedPod(null);
    showScreen('dashboard');
  }, [showScreen]);

  const goBackToPodSelection = useCallback(() => {
    setSelectedPod(null);
    // Keep search terms but reset filters
    setOpponentSearchTerm('');
    setTopicFilter('All Topics');
    setSortFilter('Sort By');
    showScreen('selectPod');
  }, [showScreen]);

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
    const percentageB = 100 - percentageA; // Ensure they always add up to 100%
    
    return { percentageA, percentageB };
  };

  // Enhanced filtering logic
  const filteredUserPods = userPods.filter(pod => {
    const matchesSearch = pod.name.toLowerCase().includes(podSearchTerm.toLowerCase()) ||
      pod.description.toLowerCase().includes(podSearchTerm.toLowerCase()) ||
      pod.tags.some(tag => tag.toLowerCase().includes(podSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const filteredOpponentPods = opponentPods.filter(pod => {
    const matchesSearch = pod.name.toLowerCase().includes(opponentSearchTerm.toLowerCase()) ||
      pod.description.toLowerCase().includes(opponentSearchTerm.toLowerCase()) ||
      pod.tags.some(tag => tag.toLowerCase().includes(opponentSearchTerm.toLowerCase()));

    const matchesTopic = topicFilter === 'All Topics' || 
      pod.tags.some(tag => tag.toLowerCase().includes(topicFilter.toLowerCase()));

    // Prevent selecting the same pod that user selected
    const isNotSamePod = !selectedPod || pod.id !== selectedPod.id;

    return matchesSearch && matchesTopic && isNotSamePod;
  }).sort((a, b) => {
    switch (sortFilter) {
      case 'Most Popular':
        return (b.winCount || 0) - (a.winCount || 0);
      case 'Recent':
        // Simple date sorting - in real app would use actual dates
        return a.createdAt.includes('day') ? -1 : 1;
      case 'Battle Wins':
        return (b.winCount || 0) - (a.winCount || 0);
      default:
        return 0;
    }
  });

  // Helper functions
  const getIconFromTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return 'lightbulb';
    const firstTag = tags[0];
    return ICON_MAPPING[firstTag] || ICON_MAPPING.default;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  const transformPodForBattle = (pod: any): ThoughtPod => ({
    id: pod.id.toString(),
    name: pod.title,
    description: pod.content.slice(0, 150) + (pod.content.length > 150 ? '...' : ''),
    icon: getIconFromTags(pod.tags),
    tags: (pod.tags || []).map((tag: any) => typeof tag === 'string' ? tag : tag.name),
    author: pod.user?.username || 'Anonymous',
    createdAt: formatDate(pod.created_at),
    battleCount: 0
  });

  if (loading) {
    return (
      <div id="battle" className="page pt-[3rem]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading battles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="battle" className="page pt-[3rem]">
      {/* Dashboard Screen */}
      {currentScreen === 'dashboard' && (
        <div className="container mx-auto px-4 py-8">
        <div>
          <div className="flex justify-between w-full md:w-[80%] mt-4 mx-auto p-2 items-center">
            <h2 className="title-font text-2xl font-bold mb-4 gradient-text">Recent Battles</h2>
              <button 
                onClick={startNewBattle}
                className="text-white px-6 py-3 rounded-full font-medium transition flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <FontAwesomeIcon icon={faShieldAlt} />
              <span>Start New Battle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBattles.map((battle) => {
                const { percentageA, percentageB } = calculatePercentages(battle.votesA, battle.votesB);
                return (
                  <div key={battle.id} className="battle-container">
                    <div className="battle-card rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} />
                    </div>
                          <span className="font-medium">{battle.podA.author}</span>
                  </div>
                        <span className="text-sm text-gray-500">{battle.startedAt}</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 mx-auto mb-2 flex items-center justify-center text-indigo-600">
                              <FontAwesomeIcon icon={getIconComponent(battle.podA.icon)} />
                      </div>
                            <p className="font-medium text-sm">{battle.podA.name}</p>
                    </div>
                    <div className="text-xl font-bold text-gray-400">VS</div>
                    <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-pink-100 mx-auto mb-2 flex items-center justify-center text-pink-600">
                              <FontAwesomeIcon icon={getIconComponent(battle.podB.icon)} />
                      </div>
                            <p className="font-medium text-sm">{battle.podB.name}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>{percentageA}%</span>
                          <span>{percentageB}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2 rounded-full" 
                            style={{width: `${percentageA}%`}}
                          ></div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                            <span className="text-sm text-gray-500">
                              <FontAwesomeIcon icon={faThumbsUp} className="mr-1" /> {battle.votesA + battle.votesB}
                            </span>
                            <span className="text-sm text-gray-500">
                              <FontAwesomeIcon icon={faComment} className="mr-1" /> 5
                            </span>
                    </div>
                          <button 
                            onClick={() => viewExistingBattle(battle)}
                            className="view-battle-btn text-sm text-indigo-600 hover:underline"
                          >
                            View Battle
                          </button>
                    </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Select Pod Screen */}
      {currentScreen === 'selectPod' && (
        <section className="container mx-auto px-4 py-8 mb-12">
        <div className="flex items-center mb-6">
            <button 
              onClick={goBackToDashboard}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
          <h1 className="title-font text-3xl font-bold gradient-text">Select Your ThoughtPod</h1>
        </div>

        <div className="mb-6">
          <div className="relative">
              <input 
                type="text" 
                placeholder="Search your ThoughtPods..."
                value={podSearchTerm}
                onChange={(e) => setPodSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUserPods.map((pod) => (
              <div key={pod.id} className="pod-card rounded-xl shadow-md overflow-hidden cursor-pointer">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <FontAwesomeIcon icon={getIconComponent(pod.icon)} />
                </div>
                    <h3 className="font-bold">{pod.name}</h3>
              </div>
                  <p className="text-gray-600 text-sm mb-4">{pod.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                    {pod.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                    <span><FontAwesomeIcon icon={faCalendar} className="mr-1" /> {pod.createdAt}</span>
                    <span><FontAwesomeIcon icon={faBolt} className="mr-1" /> {pod.battleCount} battles</span>
          </div>
                </div>
                <div className="px-4 py-3 text-right">
              <button
                    onClick={() => selectPod(pod)}
                className="select-pod-btn bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                Select for Battle
              </button>
            </div>
          </div>
            ))}
        </div>
      </section>
      )}

      {/* Select Opponent Screen */}
      {currentScreen === 'selectOpponent' && (
        <section className="container mx-auto px-4 py-8 mb-12">
        <div className="flex items-center mb-6">
            <button 
              onClick={goBackToPodSelection}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
          <h1 className="title-font text-3xl font-bold gradient-text">Select Opponent ThoughtPod</h1>
        </div>

          {selectedPod && (
            <div className="selected-pod rounded-xl p-4 mb-6 bg-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={getIconComponent(selectedPod.icon)} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Your selected ThoughtPod:</p>
                  <p className="font-bold">{selectedPod.name}</p>
            </div>
          </div>
        </div>
          )}

        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative mb-3 md:mb-0 md:w-1/2 md:mr-4">
                <input 
                  type="text" 
                  placeholder="Search public ThoughtPods..."
                  value={opponentSearchTerm}
                  onChange={(e) => setOpponentSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
            <div className="flex space-x-2">
                <select 
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="dark-select px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                <option>All Topics</option>
                <option>Lifestyle</option>
                <option>Technology</option>
                <option>Philosophy</option>
              </select>
                <select 
                  value={sortFilter}
                  onChange={(e) => setSortFilter(e.target.value)}
                  className="dark-select px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                <option>Sort By</option>
                <option>Most Popular</option>
                <option>Recent</option>
                <option>Battle Wins</option>
              </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpponentPods.map((pod) => (
              <div key={pod.id} className="pod-card rounded-xl shadow-md overflow-hidden cursor-pointer">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <FontAwesomeIcon icon={getIconComponent(pod.icon)} />
                </div>
                    <h3 className="font-bold">{pod.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{pod.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pod.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span><FontAwesomeIcon icon={faUser} className="mr-1" /> {pod.author}</span>
                    <span>
                      <FontAwesomeIcon icon={faBolt} className="mr-1" /> 
                      {pod.battleCount} battles ({pod.winCount}-{pod.lossCount}-{pod.drawCount})
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 text-right">
                  <button
                    onClick={() => selectOpponent(pod)}
                    className="select-opponent-btn bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Challenge This Pod
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
      )}
  </div>
    );
}