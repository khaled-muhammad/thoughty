import { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/brainstorm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBrain,
  faHistory,
  faCog,
  faPlay,
  faRandom,
  faSave,
  faSlidersH,
  faPaintBrush,
  faChartLine,
  faBookOpen,
  faBolt,
  faLaughSquint,
  faMicrochip,
  faDice,
  faMagic,
  faTimes,
  faTrash,
  faCloud,
  faFileExport,
  faFileImport,
  faCopy,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';

// Types
interface SpinHistoryItem {
  prompt: string;
  type: PromptType;
  theme: ThemeType;
  timestamp: string;
}

interface SavedPrompt {
  text: string;
  type: PromptType;
  theme: ThemeType;
  createdAt: string;
}

type PromptType = 'creative' | 'analytical' | 'storytelling' | 'provocative';
type ThemeType = 'funny' | 'techy' | 'deep' | 'random';
type AudienceType = 'general' | 'technical' | 'children' | 'business' | 'academic';
type ToneType = 'neutral' | 'friendly' | 'professional' | 'humorous' | 'serious';
type FormatType = 'question' | 'statement' | 'list' | 'scenario';

// Constants
const COLORS = [
  "#8b5cf6", "#a78bfa", "#10b981", "#0ea5e9",
  "#ec4899", "#f43f5e", "#f4b74d", "#e3f846cc"
];

const PROMPT_DATABASE: Record<PromptType, string[]> = {
  creative: [
    "Imagine a world where [unusual concept] is the norm. Describe it.",
    "Create a character who [unique trait]. What's their story?",
    "Write a poem about [abstract idea] from the perspective of [unusual narrator].",
    "Design a product that solves [common problem] in a completely new way.",
    "Combine [two unrelated things] to create something innovative."
  ],
  analytical: [
    "Analyze the impact of [trend/technology] on [industry/society].",
    "Compare and contrast [two concepts] in terms of [specific metric].",
    "What are the underlying factors contributing to [current event]?",
    "Create a framework for evaluating [complex topic].",
    "Break down [complex process] into its fundamental components."
  ],
  storytelling: [
    "Tell a story about [character] who discovers [life-changing secret].",
    "Write a scene where [ordinary situation] takes an unexpected turn.",
    "Describe a day in the life of [unusual profession] during [historical period].",
    "Create dialogue between [two unlikely characters] meeting for the first time.",
    "Narrate a journey where the protagonist must overcome [unique challenge]."
  ],
  provocative: [
    "Why is [common belief] actually harmful/dangerous?",
    "What if [established system] was completely abolished?",
    "Debate: [controversial statement] - defend or refute.",
    "How might [taboo subject] actually benefit society?",
    "Challenge the assumption that [widely accepted idea]."
  ]
};

const THEME_OPTIONS = {
  funny: {
    "unusual concept": ["cats ruling the world", "toothbrushes with AI", "underwater cities for squirrels"],
    "unique trait": ["can talk to furniture", "is allergic to money", "has a pet rock collection"],
    "abstract idea": ["the smell of color blue", "the sound of silence", "the taste of laughter"],
    "common problem": ["forgetting where you put your keys", "socks disappearing in the dryer", "slow internet"]
  },
  techy: {
    "unusual concept": ["quantum computing", "neural interfaces", "decentralized autonomous organizations"],
    "unique trait": ["has a brain-computer interface", "can code in their sleep", "thinks in binary"],
    "abstract idea": ["the singularity", "blockchain governance", "artificial general intelligence"],
    "common problem": ["data privacy", "algorithmic bias", "scalability issues"]
  },
  deep: {
    "unusual concept": ["the meaning of existence", "collective consciousness", "the nature of time"],
    "unique trait": ["remembers past lives", "sees the future in dreams", "feels the emotions of others"],
    "abstract idea": ["the illusion of self", "the paradox of choice", "the interconnectedness of all things"],
    "common problem": ["existential dread", "the human condition", "the search for purpose"]
  }
};

const ADJECTIVES = {
  innovative: ["groundbreaking", "cutting-edge", "revolutionary"],
  "thought-provoking": ["philosophical", "introspective", "stimulating"],
  unconventional: ["unorthodox", "radical", "avant-garde"],
  detailed: ["meticulous", "comprehensive", "thorough"],
  concise: ["succinct", "pithy", "compact"]
};

export default function Brainstorm() {
  // Canvas and spinning state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [segments, setSegments] = useState(8);
  const [duration, setDuration] = useState(3);
  
  // Prompt state
  const [currentPromptType, setCurrentPromptType] = useState<PromptType>('creative');
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('random');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  
  // Modal states
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  
  // Modal closing states for animations
  const [historyModalClosing, setHistoryModalClosing] = useState(false);
  const [settingsModalClosing, setSettingsModalClosing] = useState(false);
  const [customizeModalClosing, setCustomizeModalClosing] = useState(false);
  
  // Form states
  const [audience, setAudience] = useState<AudienceType>('general');
  const [tone, setTone] = useState<ToneType>('neutral');
  const [customPromptText, setCustomPromptText] = useState('');
  const [selectedAdjective, setSelectedAdjective] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('question');
  
  // Data states
  const [spinHistory, setSpinHistory] = useState<SpinHistoryItem[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('spinHistory');
    const savedPromptsData = localStorage.getItem('savedPrompts');
    
    if (savedHistory) {
      setSpinHistory(JSON.parse(savedHistory));
    }
    if (savedPromptsData) {
      setSavedPrompts(JSON.parse(savedPromptsData));
    }
  }, []);

  // Handle body overflow when modals are open
  useEffect(() => {
    if (showHistoryModal || showSettingsModal || showCustomizeModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showHistoryModal, showSettingsModal, showCustomizeModal]);

  // Initialize wheel
  const initWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2;
    const segmentAngle = (2 * Math.PI) / segments;

    // Draw segments
    for (let i = 0; i < segments; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = (i + 1) * segmentAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      // Add text
      const textAngle = startAngle + segmentAngle / 2;
      const textRadius = radius * 0.7;
      const textX = centerX + textRadius * Math.cos(textAngle);
      const textY = centerY + textRadius * Math.sin(textAngle);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`Idea ${i + 1}`, 0, 0);
      ctx.restore();
    }

    // Draw center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }, [segments]);

  // Initialize wheel on mount and when segments change
  useEffect(() => {
    initWheel();
  }, [initWheel]);

  // Apply theme to prompt
  const applyTheme = useCallback((prompt: string, theme: ThemeType): string => {
    if (theme === 'random') return prompt;
    
    const themeData = THEME_OPTIONS[theme];
    if (!themeData) return prompt;

    return prompt.replace(/\[(.*?)\]/g, (match, p1) => {
      const options = themeData[p1 as keyof typeof themeData];
      return options ? options[Math.floor(Math.random() * options.length)] : p1;
    });
  }, []);

  // Apply audience and tone
  const applyAudienceAndTone = useCallback((prompt: string, audience: AudienceType, tone: ToneType): string => {
    let modifiedPrompt = prompt;

    // Apply audience
    switch (audience) {
      case 'technical':
        modifiedPrompt = 'For a technical audience: ' + modifiedPrompt;
        break;
      case 'children':
        modifiedPrompt = 'Explain to a child: ' + modifiedPrompt.toLowerCase();
        break;
      case 'business':
        modifiedPrompt = 'In a business context: ' + modifiedPrompt;
        break;
      case 'academic':
        modifiedPrompt = 'With academic rigor: ' + modifiedPrompt;
        break;
    }

    // Apply tone
    switch (tone) {
      case 'friendly':
        modifiedPrompt = modifiedPrompt.replace(/\.$/, ' in a friendly, approachable way.');
        break;
      case 'professional':
        modifiedPrompt = modifiedPrompt.replace(/\.$/, ' in a professional manner.');
        break;
      case 'humorous':
        modifiedPrompt = modifiedPrompt.replace(/\.$/, ' with a humorous twist.');
        break;
      case 'serious':
        modifiedPrompt = modifiedPrompt.replace(/\.$/, ' with serious consideration.');
        break;
    }

    return modifiedPrompt;
  }, []);

  // Add to history
  const addToHistory = useCallback((prompt: string) => {
    const newItem: SpinHistoryItem = {
      prompt,
      type: currentPromptType,
      theme: currentTheme,
      timestamp: new Date().toISOString()
    };

    setSpinHistory(prev => {
      const updated = [newItem, ...prev].slice(0, 10);
      localStorage.setItem('spinHistory', JSON.stringify(updated));
      return updated;
    });
  }, [currentPromptType, currentTheme]);

  // Spin wheel
  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset rotation
    canvas.style.transition = 'none';
    canvas.style.transform = 'rotate(0deg)';
    void canvas.offsetWidth; // Force reflow

    // Set up spinning animation
    canvas.style.transition = `transform ${duration}s cubic-bezier(0.17, 0.67, 0.12, 0.99)`;

    const selectedSegment = Math.floor(Math.random() * segments);
    const segmentAngle = (2 * Math.PI) / segments;
    const spins = 5;
    const rotation = spins * 2 * Math.PI + (2 * Math.PI - (selectedSegment * segmentAngle + segmentAngle / 2));

    canvas.style.transform = `rotate(${-rotation}rad)`;

    setTimeout(() => {
      setIsSpinning(false);
      const prompts = PROMPT_DATABASE[currentPromptType];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      let themedPrompt = applyTheme(randomPrompt, currentTheme);
      themedPrompt = applyAudienceAndTone(themedPrompt, audience, tone);

      setCurrentPrompt(themedPrompt);
      setShowResult(true);
      addToHistory(themedPrompt);
    }, duration * 1000);
  }, [isSpinning, duration, segments, currentPromptType, currentTheme, audience, tone, applyTheme, applyAudienceAndTone, addToHistory]);

  // Remix prompt
  const remixPrompt = useCallback(() => {
    if (!currentPrompt) return;

    const prompts = PROMPT_DATABASE[currentPromptType];
    const basePrompt = prompts.find(p => currentPrompt.includes(p.split('[')[0]));

    if (basePrompt) {
      let remixedPrompt = applyTheme(basePrompt, currentTheme);
      remixedPrompt = applyAudienceAndTone(remixedPrompt, audience, tone);
      setCurrentPrompt(remixedPrompt);
      addToHistory(remixedPrompt);
    }
  }, [currentPrompt, currentPromptType, currentTheme, audience, tone, applyTheme, applyAudienceAndTone, addToHistory]);

  // Save prompt
  const savePrompt = useCallback(() => {
    if (!currentPrompt) return;

    const prompt: SavedPrompt = {
      text: currentPrompt,
      type: currentPromptType,
      theme: currentTheme,
      createdAt: new Date().toISOString()
    };

    setSavedPrompts(prev => {
      const updated = [prompt, ...prev];
      localStorage.setItem('savedPrompts', JSON.stringify(updated));
      return updated;
    });

    alert('Prompt saved to your Pods!');
  }, [currentPrompt, currentPromptType, currentTheme]);

  // Copy to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setSpinHistory([]);
    localStorage.setItem('spinHistory', JSON.stringify([]));
  }, []);

  // Export data
  const exportData = useCallback(() => {
    const data = {
      history: spinHistory,
      savedPrompts: savedPrompts
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-wheel-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [spinHistory, savedPrompts]);

  // Import data
  const importData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.history) {
          setSpinHistory(data.history);
          localStorage.setItem('spinHistory', JSON.stringify(data.history));
        }
        
        if (data.savedPrompts) {
          setSavedPrompts(data.savedPrompts);
          localStorage.setItem('savedPrompts', JSON.stringify(data.savedPrompts));
        }
        
        alert('Import successful!');
      } catch (err) {
        alert('Import failed: Invalid file format');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  }, []);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent, closeModal: () => void) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, []);

  // Modal close functions with animations
  const closeHistoryModal = useCallback(() => {
    setHistoryModalClosing(true);
    setTimeout(() => {
      setShowHistoryModal(false);
      setHistoryModalClosing(false);
    }, 200);
  }, []);

  const closeSettingsModal = useCallback(() => {
    setSettingsModalClosing(true);
    setTimeout(() => {
      setShowSettingsModal(false);
      setSettingsModalClosing(false);
    }, 200);
  }, []);

  const closeCustomizeModal = useCallback(() => {
    setCustomizeModalClosing(true);
    setTimeout(() => {
      setShowCustomizeModal(false);
      setCustomizeModalClosing(false);
    }, 200);
  }, []);

  // Customize prompt
  const handleCustomizePrompt = useCallback(() => {
    if (!currentPrompt) {
      alert('Please spin the wheel first to get a prompt to customize.');
      return;
    }
    setCustomPromptText(currentPrompt);
    setShowCustomizeModal(true);
  }, [currentPrompt]);

  // Save custom prompt
  const saveCustomPrompt = useCallback(() => {
    let customizedPrompt = customPromptText;

    // Apply adjective if selected
    if (selectedAdjective) {
      const adjOptions = ADJECTIVES[selectedAdjective as keyof typeof ADJECTIVES];
      const randomAdj = adjOptions[Math.floor(Math.random() * adjOptions.length)];
      customizedPrompt = `${randomAdj} ${customizedPrompt.toLowerCase()}`;
    }

    // Apply format if changed
    if (selectedFormat !== 'question') {
      switch (selectedFormat) {
        case 'statement':
          customizedPrompt = customizedPrompt.replace(/\?$/, '.');
          break;
        case 'list':
          customizedPrompt = `List 5 aspects of: ${customizedPrompt.replace(/\?$/, '')}`;
          break;
        case 'scenario':
          customizedPrompt = `Imagine a scenario where ${customizedPrompt.toLowerCase().replace(/\?$/, '')}. Describe it in detail.`;
          break;
      }
    }

    setCurrentPrompt(customizedPrompt);
    closeCustomizeModal();
    addToHistory(customizedPrompt);
  }, [customPromptText, selectedAdjective, selectedFormat, addToHistory, closeCustomizeModal]);

  // Helper functions for CSS classes
  const getColorForType = (type: PromptType): string => {
    switch (type) {
      case 'creative': return 'primary';
      case 'analytical': return 'secondary';
      case 'storytelling': return 'accent';
      case 'provocative': return 'red-600';
      default: return 'gray-600';
    }
  };

  const getColorForTheme = (theme: ThemeType): string => {
    switch (theme) {
      case 'funny': return 'yellow-600';
      case 'techy': return 'primary';
      case 'deep': return 'secondary';
      case 'random': return 'accent';
      default: return 'gray-600';
    }
  };

  return (
    <div id="brainstorm" className="page pt-[5rem]">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-primary">
            <FontAwesomeIcon icon={faBrain} className="mr-2" /> Prompt Wheel Spinner
          </h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="bg-primary hover:bg-primary-light px-4 py-2 rounded-lg flex items-center"
            >
              <FontAwesomeIcon icon={faHistory} className="mr-2" /> History
            </button>
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="bg-accent hover:bg-primary-light px-4 py-2 rounded-lg flex items-center"
            >
              <FontAwesomeIcon icon={faCog} className="mr-2" /> Settings
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Wheel Section */}
          <div className="lg:col-span-2 bg-card backdrop-blur-md rounded-xl p-6 shadow-xl">
            <div className="wheel-container">
              <canvas ref={canvasRef} width="400" height="400"></canvas>
              <div className="wheel-center" onClick={spinWheel}>
                <FontAwesomeIcon 
                  icon={isSpinning ? faSyncAlt : faPlay} 
                  className={`text-purple-500 text-xl ${isSpinning ? 'fa-spin' : ''}`} 
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              {showResult && (
                <div className="bg-input rounded-lg p-4 mb-4 min-h-16">
                  <h3 className="text-lg font-semibold mb-2">Your Prompt:</h3>
                  <p className="text-xl">{currentPrompt}</p>
                </div>
              )}

              {showResult && (
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={remixPrompt}
                    className="bg-accent hover:bg-primary-light px-6 py-3 rounded-lg flex items-center"
                  >
                    <FontAwesomeIcon icon={faRandom} className="mr-2" /> Remix
                  </button>
                  <button
                    onClick={savePrompt}
                    className="bg-secondary hover:bg-primary-light px-6 py-3 rounded-lg flex items-center"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" /> Create Pod
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-card backdrop-blur-md rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faSlidersH} className="mr-2" /> Controls
            </h2>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Prompt Types</h3>
              <div className="grid grid-cols-2 gap-2">
                {(['creative', 'analytical', 'storytelling', 'provocative'] as PromptType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCurrentPromptType(type)}
                    className={`prompt-type-btn p-2 rounded ${
                      type === 'creative' ? 'bg-gradient-primary' :
                      type === 'analytical' ? 'bg-gradient-secondary' :
                      type === 'storytelling' ? 'bg-gradient-accent' :
                      'bg-gradient-to-r from-red-600 to-yellow-600'
                    } ${currentPromptType === type ? 'ring-2 ring-white' : ''}`}
                  >
                    <FontAwesomeIcon 
                      icon={
                        type === 'creative' ? faPaintBrush :
                        type === 'analytical' ? faChartLine :
                        type === 'storytelling' ? faBookOpen : faBolt
                      } 
                      className="mr-1" 
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Themes</h3>
              <div className="flex flex-wrap gap-2">
                {(['funny', 'techy', 'deep', 'random'] as ThemeType[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setCurrentTheme(theme)}
                    className={`theme-chip px-3 py-1 rounded-full ${
                      theme === 'funny' ? 'bg-yellow-600' :
                      theme === 'techy' ? 'bg-primary' :
                      theme === 'deep' ? 'bg-secondary' : 'bg-accent'
                    } ${currentTheme === theme ? 'ring-2 ring-white' : ''}`}
                  >
                    <FontAwesomeIcon 
                      icon={
                        theme === 'funny' ? faLaughSquint :
                        theme === 'techy' ? faMicrochip :
                        theme === 'deep' ? faBrain : faDice
                      } 
                      className="mr-1" 
                    />
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Audience</h3>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value as AudienceType)}
                className="w-full bg-input rounded-lg p-2 border border-input"
              >
                <option value="general">General Audience</option>
                <option value="technical">Technical Audience</option>
                <option value="children">Children</option>
                <option value="business">Business Professionals</option>
                <option value="academic">Academic Audience</option>
              </select>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Tone</h3>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneType)}
                className="w-full bg-input rounded-lg p-2 border border-input"
              >
                <option value="neutral">Neutral</option>
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="humorous">Humorous</option>
                <option value="serious">Serious</option>
              </select>
            </div>

            <button 
              onClick={handleCustomizePrompt}
              className="w-full bg-gradient-primary hover:opacity-90 p-3 rounded-lg font-bold"
            >
              <FontAwesomeIcon icon={faMagic} className="mr-2" /> Customize Prompt
            </button>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center modal-backdrop ${historyModalClosing ? 'closing' : ''}`}
          onClick={(e) => handleBackdropClick(e, closeHistoryModal)}
        >
          <div className={`bg-dark rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl modal-content ${historyModalClosing ? 'closing' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                <FontAwesomeIcon icon={faHistory} className="mr-2" /> Spin History
              </h2>
              <button 
                onClick={closeHistoryModal}
                className="text-gray-400 hover:text-light transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            <div className="space-y-2">
              {spinHistory.map((item, index) => (
                <div 
                  key={index}
                  className="history-item bg-input p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-opacity-80 hover:transform hover:scale-[1.02]"
                  onClick={() => {
                    setCurrentPrompt(item.prompt);
                    setShowResult(true);
                    closeHistoryModal();
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.prompt}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <span className={`bg-${getColorForType(item.type)} px-2 py-1 rounded-full mr-2`}>
                          {item.type}
                        </span>
                        <span className={`bg-${getColorForTheme(item.theme)} px-2 py-1 rounded-full`}>
                          {item.theme}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.prompt);
                      }}
                      className="text-gray-400 hover:text-light ml-2 p-1 rounded transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={clearHistory}
              className="mt-4 w-full bg-red-600 hover:bg-red-500 p-2 rounded-lg transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" /> Clear History
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center modal-backdrop ${settingsModalClosing ? 'closing' : ''}`}
          onClick={(e) => handleBackdropClick(e, closeSettingsModal)}
        >
          <div className={`bg-dark rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl modal-content ${settingsModalClosing ? 'closing' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                <FontAwesomeIcon icon={faCog} className="mr-2" /> Settings
              </h2>
              <button 
                onClick={closeSettingsModal}
                className="text-gray-400 hover:text-light transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Cloud Sync</h3>
                <p className="text-sm text-gray-400 mb-2">Save your prompts to the cloud (requires login)</p>
                <button 
                  onClick={() => alert('Cloud sync would connect to API in production')}
                  className="w-full bg-primary hover:bg-primary-light p-2 rounded-lg transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faCloud} className="mr-2" /> Enable Cloud Sync
                </button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Export/Import</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={exportData}
                    className="bg-secondary hover:bg-secondary/90 p-2 rounded-lg transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faFileExport} className="mr-2" /> Export
                  </button>
                  <label className="bg-accent hover:bg-accent/90 p-2 rounded-lg cursor-pointer text-center transition-colors duration-200">
                    <FontAwesomeIcon icon={faFileImport} className="mr-2" /> Import
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={importData}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Wheel Customization</h3>
                <div className="flex items-center mb-2">
                  <label className="mr-2">Segments:</label>
                  <input 
                    type="range" 
                    min="4" 
                    max="12" 
                    value={segments}
                    onChange={(e) => setSegments(parseInt(e.target.value))}
                    className="w-full" 
                  />
                  <span className="ml-2 w-8 text-center">{segments}</span>
                </div>
                <div className="flex items-center">
                  <label className="mr-2">Spin Duration:</label>
                  <input 
                    type="range" 
                    min="3" 
                    max="10" 
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full" 
                  />
                  <span className="ml-2 w-8 text-center">{duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Customization Modal */}
      {showCustomizeModal && (
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center modal-backdrop ${customizeModalClosing ? 'closing' : ''}`}
          onClick={(e) => handleBackdropClick(e, closeCustomizeModal)}
        >
          <div className={`bg-dark rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl modal-content ${customizeModalClosing ? 'closing' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                <FontAwesomeIcon icon={faMagic} className="mr-2" /> Customize Prompt
              </h2>
              <button 
                onClick={closeCustomizeModal}
                className="text-gray-400 hover:text-light transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Prompt Text</label>
              <textarea 
                value={customPromptText}
                onChange={(e) => setCustomPromptText(e.target.value)}
                className="w-full bg-input rounded-lg p-3 border border-input min-h-32 transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2">Adjectives</label>
                <select 
                  value={selectedAdjective}
                  onChange={(e) => setSelectedAdjective(e.target.value)}
                  className="w-full bg-input rounded-lg p-2 border border-input transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">None</option>
                  <option value="innovative">Innovative</option>
                  <option value="thought-provoking">Thought-provoking</option>
                  <option value="unconventional">Unconventional</option>
                  <option value="detailed">Detailed</option>
                  <option value="concise">Concise</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Format</label>
                <select 
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as FormatType)}
                  className="w-full bg-input rounded-lg p-2 border border-input transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="question">Question</option>
                  <option value="statement">Statement</option>
                  <option value="list">List</option>
                  <option value="scenario">Scenario</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={closeCustomizeModal}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={saveCustomPrompt}
                className="bg-primary hover:bg-primary-light px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" /> Save Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}