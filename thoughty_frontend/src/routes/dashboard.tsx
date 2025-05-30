import { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFire, 
  faComment, 
  faArrowRight, 
  faUser, 
  faPlusCircle, 
  faChevronRight, 
  faTrophy, 
  faRandom, 
  faMedal, 
  faLightbulb, 
  faBrain, 
  faBolt, 
  faStar, 
  faAtom, 
  faInfinity, 
  faPlus,
  faHeart,
  faShare,
  faBookmark
} from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { usePodModal } from '../contexts/PodModalContext';
import { Link, Navigate } from 'react-router-dom';

// Mock data interfaces
interface Pod {
  id: string;
  title: string;
  author: string;
  timeAgo: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface Activity {
  id: string;
  type: 'comment' | 'create' | 'battle';
  description: string;
  timeAgo: string;
  icon: IconProp;
  color: string;
}

interface UserStats {
  pods: number;
  points: number;
  badges: number;
  level: number;
  nextLevelPoints: number;
  currentPoints: number;
}

export default function Dashboard() {
  // State management
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'recommended'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [pods, setPods] = useState<Pod[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userStats] = useState<UserStats>({
    pods: 24,
    points: 1200,
    badges: 8,
    level: 7,
    nextLevelPoints: 1500,
    currentPoints: 1200
  });
  const [isLoading, setIsLoading] = useState(false);
  const { openModal } = usePodModal();
  
  // Mock data initialization
  useEffect(() => {
    const mockPods: Pod[] = [
      {
        id: '1',
        title: 'The Future of AI Consciousness',
        author: 'NeuroExplorer',
        timeAgo: '2 hours ago',
        content: 'Exploring the ethical implications and technological breakthroughs that might lead to artificial consciousness in our lifetime...',
        tags: ['#AI', '#Ethics', '#Future'],
        likes: 124,
        comments: 42,
        isLiked: false,
        isBookmarked: false
      },
      {
        id: '2',
        title: 'Quantum Mind Theories',
        author: 'QuantumThinker',
        timeAgo: '5 hours ago',
        content: 'How quantum mechanics might explain consciousness and the nature of human thought processes at a fundamental level...',
        tags: ['#Quantum', '#Neuroscience', '#Physics'],
        likes: 89,
        comments: 31,
        isLiked: true,
        isBookmarked: false
      },
      {
        id: '3',
        title: 'The Art of Creative Block',
        author: 'ArtMind',
        timeAgo: '1 day ago',
        content: 'Strategies and psychological insights to overcome creative blocks and unlock your artistic potential...',
        tags: ['#Creativity', '#Psychology', '#Art'],
        likes: 76,
        comments: 28,
        isLiked: false,
        isBookmarked: true
      }
    ];

    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'comment',
        description: 'Commented on Quantum Mind Theories',
        timeAgo: '2 hours ago',
        icon: faComment,
        color: 'primary'
      },
      {
        id: '2',
        type: 'create',
        description: 'Created pod Consciousness in Machines',
        timeAgo: '1 day ago',
        icon: faPlus,
        color: 'secondary'
      },
      {
        id: '3',
        type: 'battle',
        description: 'Won battle in AI Ethics',
        timeAgo: '3 days ago',
        icon: faTrophy,
        color: 'accent'
      }
    ];

    setPods(mockPods);
    setActivities(mockActivities);
  }, []);

  // Event handlers
  const handleTabChange = (tab: 'trending' | 'new' | 'recommended') => {
    setActiveTab(tab);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate search API call
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const handleLikePod = (podId: string) => {
    setPods(prevPods => 
      prevPods.map(pod => 
        pod.id === podId 
          ? { 
              ...pod, 
              isLiked: !pod.isLiked,
              likes: pod.isLiked ? pod.likes - 1 : pod.likes + 1
            }
          : pod
      )
    );
  };

  const handleBookmarkPod = (podId: string) => {
    setPods(prevPods => 
      prevPods.map(pod => 
        pod.id === podId 
          ? { ...pod, isBookmarked: !pod.isBookmarked }
          : pod
      )
    );
  };

  const handleSharePod = (podId: string) => {
    // Simulate sharing functionality
    navigator.clipboard.writeText(`${window.location.origin}/pod/${podId}`);
    // You could add a toast notification here
    console.log('Pod link copied to clipboard!');
  };

  const handleCreatePod = () => {
    openModal();
  };

  const handleRoulette = () => {
    // Implement roulette functionality
    console.log('Starting thought roulette...');
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading more pods
    setTimeout(() => {
      const newPods: Pod[] = [
        {
          id: '4',
          title: 'Digital Minimalism in the Age of AI',
          author: 'TechPhilosopher',
          timeAgo: '2 days ago',
          content: 'How to maintain focus and intentionality in our increasingly connected world...',
          tags: ['#Minimalism', '#Technology', '#Mindfulness'],
          likes: 156,
          comments: 67,
          isLiked: false,
          isBookmarked: false
        }
      ];
      setPods(prevPods => [...prevPods, ...newPods]);
      setIsLoading(false);
    }, 800);
  };

  const filteredPods = pods.filter(pod => {
    const matchesSearch = pod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pod.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pod.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || 
                           pod.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  const progressPercentage = (userStats.currentPoints / userStats.nextLevelPoints) * 100;

    return (
    <div id="dashboard" className="page min-h-screen overflow-x-hidden">
      <main className="container mx-auto pt-[6rem] pb-12 px-3 sm:px-4 lg:px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Main Feed Section */}
          <div className="w-full lg:w-2/3 min-w-0">
            <div className="space-y-6 lg:space-y-8">
              {/* Header Section */}
              <div className="space-y-4 lg:space-y-6">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">Thought Pods</h2>

            {/* Feed Tabs */}
                <div className="flex border-b border-input-br overflow-x-auto scrollbar-hide">
                  {(['trending', 'new', 'recommended'] as const).map((tab) => (
              <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`px-4 sm:px-6 py-3 font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                        activeTab === tab
                          ? 'tab-active border-b-2 border-primary text-primary'
                          : 'text-primary-light hover:text-primary'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
            </div>
            </div>

              {/* Search and Filter Section */}
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Search pods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-input-bg border border-input-br rounded-lg py-3 pl-10 sm:pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-light transition-all text-sm sm:text-base"
                  />
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 sm:left-4 top-3.5 sm:top-4 text-primary-light text-sm" />
              </div>
              <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-input-bg border border-input-br rounded-lg py-3 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-primary-light transition-all min-w-[140px] sm:min-w-[160px] text-sm sm:text-base"
                >
                <option>All Categories</option>
                <option>Technology</option>
                <option>Philosophy</option>
                <option>Science</option>
                <option>Art</option>
                  <option>Psychology</option>
                  <option>Physics</option>
              </select>
              </form>

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
              )}

              {/* Feed Cards Section */}
              {!isLoading && (
                <div className="space-y-6 lg:space-y-8">
                  {filteredPods.map((pod) => (
                    <div key={pod.id} className="card-gradient rounded-xl p-4 sm:p-6 lg:p-8 border border-input-br transition-all duration-300 hover:border-primary-light hover:shadow-lg hover:shadow-primary/10">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 lg:mb-6 gap-3 sm:gap-0">
                        <div className="space-y-2 min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl font-bold leading-tight">{pod.title}</h3>
                          <p className="text-primary-light text-sm">
                            by <span className="text-secondary font-medium">{pod.author}</span> • {pod.timeAgo}
                          </p>
                  </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                          <span className="bg-dark/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2">
                            <FontAwesomeIcon icon={faFire} className="text-accent text-xs sm:text-sm" />
                            <span>{pod.likes}</span>
                    </span>
                          <span className="bg-dark/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2">
                            <FontAwesomeIcon icon={faComment} className="text-primary-light text-xs sm:text-sm" />
                            <span>{pod.comments}</span>
                    </span>
                  </div>
                </div>
                      <p className="text-primary-light mb-6 lg:mb-8 leading-relaxed text-sm sm:text-base">{pod.content}</p>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {pod.tags.map((tag, index) => (
                            <span key={index} className="bg-dark/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap">
                              {tag}
                            </span>
                          ))}
                  </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleLikePod(pod.id)}
                              className={`p-2 rounded-lg transition-all text-sm ${
                                pod.isLiked 
                                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                  : 'bg-dark/50 text-primary-light hover:bg-dark/70'
                              }`}
                            >
                              <FontAwesomeIcon icon={faHeart} />
                            </button>
                            <button
                              onClick={() => handleBookmarkPod(pod.id)}
                              className={`p-2 rounded-lg transition-all text-sm ${
                                pod.isBookmarked 
                                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                                  : 'bg-dark/50 text-primary-light hover:bg-dark/70'
                              }`}
                            >
                              <FontAwesomeIcon icon={faBookmark} />
                            </button>
                  <button
                              onClick={() => handleSharePod(pod.id)}
                              className="p-2 rounded-lg bg-dark/50 text-primary-light hover:bg-dark/70 transition-all text-sm"
                            >
                              <FontAwesomeIcon icon={faShare} />
                            </button>
                          </div>
                          <button className="bg-primary hover:bg-primary-light px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center space-x-2 text-sm sm:text-base">
                            <span>Explore</span>
                            <FontAwesomeIcon icon={faArrowRight} className="text-xs sm:text-sm" />
                  </button>
                </div>
              </div>
                  </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && filteredPods.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-primary-light text-lg">No pods found matching your criteria.</p>
                  <p className="text-primary-light/70 text-sm mt-2">Try adjusting your search or category filter.</p>
                </div>
              )}

              {/* Load More Section */}
              {!isLoading && filteredPods.length > 0 && (
                <div className="text-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    className="bg-input-bg border border-input-br hover:border-primary-light px-6 sm:px-8 py-3 rounded-lg font-medium transition-all hover:shadow-md text-sm sm:text-base"
                  >
                    Load More Pods
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="w-full lg:w-1/3 lg:max-w-sm">
            <div className="bg-card-bg rounded-xl p-4 sm:p-6 lg:p-8 border border-input-br lg:sticky lg:top-24 space-y-6 lg:space-y-8">
              {/* Profile Section */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-2xl sm:text-3xl text-primary-light" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-xs font-bold">3</span>
        </div>
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold truncate">ThoughtExplorer</h3>
                  <p className="text-primary-light text-sm">Level {userStats.level} MindPodder</p>
              </div>
            </div>

            {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="stats-card bg-dark/50 rounded-lg p-3 sm:p-4 text-center border border-input-br transition-all hover:border-primary/30 cursor-pointer">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1 sm:mb-2">{userStats.pods}</div>
                <div className="text-xs text-primary-light">Pods</div>
              </div>
                <div className="stats-card bg-dark/50 rounded-lg p-3 sm:p-4 text-center border border-input-br transition-all hover:border-secondary/30 cursor-pointer">
                  <div className="text-xl sm:text-2xl font-bold text-secondary mb-1 sm:mb-2">{userStats.points.toLocaleString()}</div>
                <div className="text-xs text-primary-light">Points</div>
              </div>
                <div className="stats-card bg-dark/50 rounded-lg p-3 sm:p-4 text-center border border-input-br transition-all hover:border-accent/30 cursor-pointer">
                  <div className="text-xl sm:text-2xl font-bold text-accent mb-1 sm:mb-2">{userStats.badges}</div>
                <div className="text-xs text-primary-light">Badges</div>
              </div>
            </div>

            {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Next Level ({userStats.nextLevelPoints.toLocaleString()})</span>
                  <span className="text-primary-light">{userStats.currentPoints.toLocaleString()}/{userStats.nextLevelPoints.toLocaleString()}</span>
              </div>
                <div className="w-full bg-dark/50 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500" 
                    style={{width: `${progressPercentage}%`}}
                  ></div>
              </div>
            </div>

            {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="font-bold text-base sm:text-lg">Quick Actions</h3>
            <div className="space-y-3">
                  <button
                    onClick={handleCreatePod}
                    className="w-full bg-primary hover:bg-primary-light py-3 sm:py-4 px-4 sm:px-5 rounded-lg flex items-center justify-between transition-all hover:shadow-lg text-sm sm:text-base"
                  >
                    <span className="flex items-center space-x-2 sm:space-x-3">
                      <FontAwesomeIcon icon={faPlusCircle} className="text-sm sm:text-base" />
                      <span className="font-medium">Create Pod</span>
                </span>
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs sm:text-sm" />
                  </button>
                  <Link
                    to='/battles'
                    className="w-full bg-secondary hover:bg-green-500 py-3 sm:py-4 px-4 sm:px-5 rounded-lg flex items-center justify-between transition-all hover:shadow-lg text-sm sm:text-base"
                  >
                    <span className="flex items-center space-x-2 sm:space-x-3">
                      <FontAwesomeIcon icon={faTrophy} className="text-sm sm:text-base" />
                      <span className="font-medium">Start Battle</span>
                </span>
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs sm:text-sm" />
                  </Link>
              <Link
                    to="/brainstorm"
                    className="w-full bg-accent hover:bg-pink-500 py-3 sm:py-4 px-4 sm:px-5 rounded-lg flex items-center justify-between transition-all hover:shadow-lg text-sm sm:text-base"
                  >
                    <span className="flex items-center space-x-2 sm:space-x-3">
                      <FontAwesomeIcon icon={faRandom} className="text-sm sm:text-base" />
                      <span className="font-medium">Roulette</span>
                </span>
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs sm:text-sm" />
              </Link>
            </div>
              </div>

              {/* Badges Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-base sm:text-lg">Your Badges</h3>
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { icon: faMedal, gradient: 'from-yellow-400 to-amber-500', glow: 'yellow-400', name: 'First Pod', description: 'Created your first thought pod' },
                    { icon: faLightbulb, gradient: 'from-blue-400 to-cyan-500', glow: 'blue-400', name: 'Innovator', description: 'Shared groundbreaking ideas' },
                    { icon: faBrain, gradient: 'from-purple-400 to-violet-600', glow: 'purple-400', name: 'Deep Thinker', description: 'Engaged in complex discussions' },
                    { icon: faFire, gradient: 'from-green-400 to-emerald-500', glow: 'green-400', name: 'Trending', description: 'Your pod went viral' },
                    { icon: faBolt, gradient: 'from-red-400 to-rose-500', glow: 'red-400', name: 'Quick Wit', description: 'Lightning-fast responses' },
                    { icon: faStar, gradient: 'from-pink-400 to-fuchsia-500', glow: 'pink-400', name: 'Rising Star', description: 'Gaining popularity fast' },
                    { icon: faAtom, gradient: 'from-indigo-400 to-blue-600', glow: 'indigo-400', name: 'Scientist', description: 'Evidence-based thinking' },
                    { icon: faInfinity, gradient: 'from-teal-400 to-cyan-600', glow: 'teal-400', name: 'Philosopher', description: 'Explored infinite possibilities' }
                  ].map((badge, index) => (
                    <div
                      key={index}
                      className="group relative cursor-pointer"
                      title={`${badge.name}: ${badge.description}`}
                    >
                      {/* Badge Container */}
                      <div className={`
                        relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full 
                        bg-gradient-to-br ${badge.gradient}
                        shadow-lg shadow-${badge.glow}/30
                        border-2 border-white/20
                        transition-all duration-300 ease-out
                        group-hover:scale-110 
                        group-hover:shadow-xl 
                        group-hover:shadow-${badge.glow}/50
                        group-hover:border-white/40
                        flex items-center justify-center
                        before:absolute before:inset-0 before:rounded-full
                        before:bg-gradient-to-br before:${badge.gradient}
                        before:opacity-0 before:blur-md
                        before:transition-opacity before:duration-300
                        group-hover:before:opacity-60
                        animate-pulse-slow
                      `}>
                        {/* Inner glow effect */}
                        <div className={`
                          absolute inset-1 rounded-full 
                          bg-gradient-to-br from-white/30 to-transparent
                          opacity-60
                        `} />
                        
                        {/* Icon */}
                        <FontAwesomeIcon 
                          icon={badge.icon} 
                          className="text-white text-sm sm:text-base lg:text-lg relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" 
                        />
                        
                        {/* Sparkle effect */}
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full animate-ping" />
                          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-0.5 h-0.5 bg-white rounded-full animate-ping animation-delay-150" />
                          <div className="absolute top-2 sm:top-4 left-1 sm:left-2 w-0.5 h-0.5 bg-white rounded-full animate-ping animation-delay-300" />
              </div>
            </div>

                      {/* Tooltip - Hidden on mobile */}
                      <div className={`
                        hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                        bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2
                        opacity-0 group-hover:opacity-100 transition-all duration-300
                        pointer-events-none z-20 whitespace-nowrap
                        border border-white/10 shadow-xl
                        before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2
                        before:border-4 before:border-transparent before:border-t-gray-900/95
                      `}>
                        <div className="font-semibold text-white">{badge.name}</div>
                        <div className="text-gray-300 text-xs mt-1">{badge.description}</div>
                </div>
                      
                      {/* Floating particles effect - Reduced on mobile */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className={`absolute top-0 left-1/2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-${badge.glow} rounded-full animate-float-up animation-delay-0`} />
                        <div className={`absolute top-1/2 right-0 w-0.5 h-0.5 bg-${badge.glow} rounded-full animate-float-right animation-delay-200`} />
                        <div className={`absolute bottom-0 left-1/4 w-0.5 h-0.5 bg-${badge.glow} rounded-full animate-float-up animation-delay-400`} />
                </div>
              </div>
                  ))}
                </div>
                
                {/* Badge Progress Indicator */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-dark/30 rounded-lg border border-input-br">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Badge Progress</span>
                    <span className="text-xs text-primary-light">8/12 Collected</span>
                  </div>
                  <div className="w-full bg-dark/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary via-secondary to-accent h-2 rounded-full transition-all duration-500" style={{width: "67%"}}></div>
                  </div>
                  <p className="text-xs text-primary-light mt-2">4 more badges to unlock the next tier!</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h3 className="font-bold text-base sm:text-lg">Recent Activity</h3>
                <div className="space-y-3 sm:space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4 cursor-pointer hover:bg-dark/20 p-2 rounded-lg transition-all">
                      <div className={`bg-${activity.color}/10 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-${activity.color} flex-shrink-0`}>
                        <FontAwesomeIcon icon={activity.icon} className="text-xs sm:text-sm" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm leading-relaxed">{activity.description}</p>
                        <p className="text-xs text-primary-light">{activity.timeAgo}</p>
                </div>
                </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
    );
}