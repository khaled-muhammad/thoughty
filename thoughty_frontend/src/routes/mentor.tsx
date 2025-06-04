import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTags, 
  faChartLine, 
  faLightbulb, 
  faFilter, 
  faStar as faStarSolid, 
  faRobot, 
  faChevronLeft, 
  faChevronRight, 
  faPlus 
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import '../styles/mentor.css';

// TypeScript interfaces
interface CategoryData {
  name: string;
  percentage: number;
}

interface ToneData {
  name: string;
  percentage: number;
}

interface Insight {
  id: number;
  category: string;
  tone: string;
  title: string;
  description: string;
  isFavorite: boolean;
  isNew: boolean;
  isDismissed: boolean;
}

interface TipPrompt {
  id: number;
  category: string;
  title: string;
  description: string;
  isFavorite: boolean;
}

interface FilterState {
  category: boolean;
  tone: boolean;
  favorites: boolean;
  new: boolean;
}

export default function Mentor() {
  // State management
  const [categories] = useState<CategoryData[]>([
    { name: 'Society', percentage: 35 },
    { name: 'Technology', percentage: 28 },
    { name: 'Emotions', percentage: 22 },
    { name: 'Creativity', percentage: 15 },
  ]);

  const [tones] = useState<ToneData[]>([
    { name: 'Optimistic', percentage: 45 },
    { name: 'Philosophical', percentage: 30 },
    { name: 'Analytical', percentage: 15 },
    { name: 'Critical', percentage: 10 },
  ]);

  const [insights, setInsights] = useState<Insight[]>([
    {
      id: 1,
      category: 'creativity',
      tone: 'optimistic',
      title: 'Idea Depth',
      description: 'Your ideas show great breadth but could benefit from deeper exploration. Try the "5 Whys" technique to dig deeper into concepts.',
      isFavorite: false,
      isNew: true,
      isDismissed: false
    },
    {
      id: 2,
      category: 'optimistic',
      tone: 'optimistic',
      title: 'Style Tip',
      description: 'Your optimistic tone resonates well with readers. Consider pairing it with more concrete examples to increase impact.',
      isFavorite: true,
      isNew: false,
      isDismissed: false
    },
    {
      id: 3,
      category: 'technology',
      tone: 'analytical',
      title: 'Tech Focus',
      description: 'Your tech-related ideas often connect with societal impacts. This interdisciplinary approach could be your unique angle.',
      isFavorite: false,
      isNew: true,
      isDismissed: false
    },
    {
      id: 4,
      category: 'society',
      tone: 'philosophical',
      title: 'Social Patterns',
      description: 'You frequently notice patterns in social behavior. Try documenting these observations systematically to identify larger trends.',
      isFavorite: false,
      isNew: false,
      isDismissed: false
    }
  ]);

  const [tipPrompts, setTipPrompts] = useState<TipPrompt[]>([
    {
      id: 1,
      category: 'Society',
      title: 'Community Connection',
      description: 'Write about a local issue you care about, then brainstorm three small actions you could take to make a difference.',
      isFavorite: false
    },
    {
      id: 2,
      category: 'Philosophical',
      title: 'Deep Question',
      description: 'Reflect on this: "If you could instill one value in every child, what would it be and why?" Explore both personal and societal impacts.',
      isFavorite: false
    },
    {
      id: 3,
      category: 'Creativity',
      title: 'Idea Combination',
      description: 'Take two unrelated ideas from your recent thoughts and force a connection between them. What new concept emerges?',
      isFavorite: false
    },
    {
      id: 4,
      category: 'Emotions',
      title: 'Emotional Mapping',
      description: 'Track your emotional responses throughout a day. What patterns emerge? How do they influence your creative output?',
      isFavorite: false
    }
  ]);

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: true,
    tone: true,
    favorites: true,
    new: true
  });
  const [filteredInsights, setFilteredInsights] = useState<Insight[]>(insights);

  // Filter insights based on active filters
  useEffect(() => {
    let filtered = insights.filter(insight => !insight.isDismissed);

    if (!filters.favorites && !filters.new) {
      // If neither favorites nor new is selected, show all
    } else {
      if (filters.favorites && !filters.new) {
        filtered = filtered.filter(insight => insight.isFavorite);
      } else if (filters.new && !filters.favorites) {
        filtered = filtered.filter(insight => insight.isNew);
      } else if (filters.favorites && filters.new) {
        filtered = filtered.filter(insight => insight.isFavorite || insight.isNew);
      }
    }

    setFilteredInsights(filtered);
  }, [filters, insights]);

  // Event handlers
  const toggleFilter = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);

  const handleFilterChange = useCallback((filterType: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  }, []);

  const applyFilters = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const toggleInsightFavorite = useCallback((insightId: number) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId 
        ? { ...insight, isFavorite: !insight.isFavorite }
        : insight
    ));
  }, []);

  const toggleTipFavorite = useCallback((tipId: number) => {
    setTipPrompts(prev => prev.map(tip => 
      tip.id === tipId 
        ? { ...tip, isFavorite: !tip.isFavorite }
        : tip
    ));
  }, []);

  const dismissInsight = useCallback((insightId: number) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId 
        ? { ...insight, isDismissed: true }
        : insight
    ));
  }, []);

  const saveInsight = useCallback((insightId: number) => {
    // In a real app, this would save to backend
    console.log('Saving insight:', insightId);
    // Could also add to favorites automatically
    toggleInsightFavorite(insightId);
  }, [toggleInsightFavorite]);

  const nextTip = useCallback(() => {
    setCurrentTipIndex(prev => (prev + 1) % tipPrompts.length);
  }, [tipPrompts.length]);

  const prevTip = useCallback(() => {
    setCurrentTipIndex(prev => (prev - 1 + tipPrompts.length) % tipPrompts.length);
  }, [tipPrompts.length]);

  const handleNewInsight = useCallback(() => {
    // In a real app, this would trigger a modal or navigate to create new insight
    console.log('Creating new insight...');
  }, []);

  // Click outside handler for filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isFilterOpen && !target.closest('#filter-btn') && !target.closest('#filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

    return (
          <div id="mentor" className="page pt-[5rem]">
      {/* Page Title */}
      <section className="py-8 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold gradient-text">Mind Mentor</h2>
          <p className="text-gray-400 mt-2">
            Insights into your creative thinking patterns and personalized recommendations
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Thinking Profile */}
          <div className="lg:col-span-1 space-y-8">
            {/* Categories Chart */}
            <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--input-br)]">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faTags} className="mr-2 text-[var(--primary)]" /> 
                Idea Categories
              </h3>
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index}>
                  <div className="flex justify-between mb-1 text-sm">
                      <span>{category.name}</span>
                      <span>{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="category-bar h-2.5 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      />
                </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tone Analysis */}
            <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--input-br)]">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faChartLine} className="mr-2 text-[var(--secondary)]" /> 
                Tone Analysis
              </h3>
              <div className="space-y-3">
                {tones.map((tone, index) => (
                  <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                      <span>{tone.name}</span>
                      <span>{tone.percentage}%</span>
                  </div>
                    <div 
                      className="tone-bar" 
                      style={{ width: `${tone.percentage}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--input-br)]">
                <p className="text-sm text-gray-400">
                  Your dominant tone is{' '}
                  <span className="text-[var(--secondary)]">optimistic</span>, 
                  with a 10% increase from last month.
                </p>
              </div>
            </div>
          </div>

          {/* Middle Column - AI-Generated Insights */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--input-br)] h-full">
              <div className="flex justify-between items-center mb-6 relative">
                <h3 className="text-xl font-semibold flex items-center">
                  <FontAwesomeIcon icon={faLightbulb} className="mr-2 text-[var(--accent)]" /> 
                  Insights & Suggestions
                </h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <button 
                      id="filter-btn"
                      onClick={toggleFilter}
                      className="px-3 py-1 rounded-lg bg-[var(--input-bg)] border border-[var(--input-br)] text-sm flex items-center hover:bg-[var(--primary)] transition-colors"
                    >
                      <FontAwesomeIcon icon={faFilter} className="mr-1" /> Filter
                    </button>
                    
                    {/* Filter Dropdown */}
                    <div 
                      id="filter-dropdown" 
                      className={`filter-dropdown ${isFilterOpen ? 'active' : ''}`}
                    >
                      <h4 className="font-medium mb-2">Filter by:</h4>
                      
                      <div className="filter-option">
                        <input 
                          type="checkbox" 
                          id="filter-category" 
                          checked={filters.category}
                          onChange={() => handleFilterChange('category')}
                        />
                        <label htmlFor="filter-category">Category</label>
                      </div>
                      
                      <div className="filter-option">
                        <input 
                          type="checkbox" 
                          id="filter-tone" 
                          checked={filters.tone}
                          onChange={() => handleFilterChange('tone')}
                        />
                        <label htmlFor="filter-tone">Tone</label>
                      </div>
                      
                      <div className="filter-option">
                        <input 
                          type="checkbox" 
                          id="filter-favorites" 
                          checked={filters.favorites}
                          onChange={() => handleFilterChange('favorites')}
                        />
                        <label htmlFor="filter-favorites">Favorites</label>
                      </div>
                      
                      <div className="filter-option">
                        <input 
                          type="checkbox" 
                          id="filter-new" 
                          checked={filters.new}
                          onChange={() => handleFilterChange('new')}
                        />
                        <label htmlFor="filter-new">New</label>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-[var(--input-br)]">
                        <button 
                          onClick={applyFilters}
                          className="w-full py-1 rounded bg-[var(--primary)] text-sm hover:bg-[var(--primary-light)] transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4" id="insights-container">
                {filteredInsights.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FontAwesomeIcon icon={faLightbulb} className="text-4xl mb-4 opacity-50" />
                    <p>No insights match your current filters.</p>
                  </div>
                ) : (
                  filteredInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="insight-card p-4"
                    >
                  <div className="flex justify-between items-start mb-2">
                        <span className={`${insight.category === 'optimistic' ? 'tone-tag' : 'category-tag'} px-3 py-1 rounded-full text-xs font-medium`}>
                          {insight.category === 'optimistic' ? 'Optimistic' : 
                           insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                        </span>
                        <button 
                          className={`favorite-btn ${insight.isFavorite ? 'active' : ''}`}
                          onClick={() => toggleInsightFavorite(insight.id)}
                        >
                          <FontAwesomeIcon 
                            icon={insight.isFavorite ? faStarSolid : faStarRegular} 
                          />
                    </button>
                  </div>
                      <h4 className="font-medium mb-2">{insight.title}</h4>
                      <p className="text-sm text-gray-300">{insight.description}</p>
                  <div className="mt-3 flex justify-end space-x-2">
                        <button 
                          onClick={() => dismissInsight(insight.id)}
                          className="text-xs px-2 py-1 rounded bg-[var(--input-bg)] hover:bg-gray-600 transition-colors"
                        >
                          Dismiss
                    </button>
                        <button 
                          onClick={() => saveInsight(insight.id)}
                          className="text-xs px-2 py-1 rounded bg-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors"
                        >
                          Save
                    </button>
                  </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - AI Tip Carousel */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--input-br)] h-full flex flex-col">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <FontAwesomeIcon icon={faRobot} className="mr-2 text-[var(--primary-light)]" /> 
                Mind Prompts for You
              </h3>

              <div className="flex-1 relative overflow-hidden">
                {tipPrompts.map((tip, index) => (
                  <div
                    key={tip.id}
                    className={`carousel-item ${index === currentTipIndex ? 'active' : ''}`}
                  >
                  <div className="bg-gradient-to-br from-[var(--dark)] to-[var(--darker)] p-5 rounded-lg mb-4">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`${tip.category.toLowerCase() === 'philosophical' ? 'tone-tag' : 'category-tag'} px-3 py-1 rounded-full text-xs font-medium`}>
                          {tip.category}
                        </span>
                        <button 
                          className={`favorite-btn ${tip.isFavorite ? 'active' : ''}`}
                          onClick={() => toggleTipFavorite(tip.id)}
                        >
                          <FontAwesomeIcon 
                            icon={tip.isFavorite ? faStarSolid : faStarRegular} 
                          />
                      </button>
                    </div>
                      <h4 className="font-medium mb-2">{tip.title}</h4>
                      <p className="text-sm text-gray-300">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-[var(--input-br)]">
                <button 
                  onClick={prevTip}
                  className="px-4 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-br)] hover:bg-[var(--primary)] transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                <div className="flex space-x-2">
                  {tipPrompts.map((_, index) => (
                    <span 
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTipIndex ? 'bg-[var(--primary)]' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={nextTip}
                  className="px-4 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-br)] hover:bg-[var(--primary)] transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div 
        className="floating-btn pulse-animation" 
        onClick={handleNewInsight}
      >
        <FontAwesomeIcon icon={faPlus} className="text-white text-xl" />
      </div>
  </div>
    );
}