import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import type { PodStage, Comment as PodComment, TimelineItem } from '../types/pods';
import { STAGES } from '../types/pods';

interface NewPodData {
  title: string;
  content: string;
  stage: 'seed' | 'sprout' | 'bloom' | 'fruit';
  tags: string;
  version: string;
  isPublic: boolean;
}

interface Pod {
  id: number;
  title: string;
  content: string;
  stage: 'seed' | 'sprout' | 'bloom' | 'fruit';
  progress: number;
  lastUpdated: string;
  timeline: TimelineItem[];
  comments: PodComment[];
  isPublic: boolean;
  tags: string[];
  version: string;
  stageProgress: number;
  currentStageContent: { [key: string]: string };
}

// A utility type alias for the listener signature so we don't repeat.
type PodCreatedListener = (pod: Pod) => void;

interface PodModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  newPodData: NewPodData;
  setNewPodData: React.Dispatch<React.SetStateAction<NewPodData>>;
  handleCreatePod: () => void;
  onPodCreated: PodCreatedListener | null;
  setOnPodCreated: (callback: PodCreatedListener | null) => void;
}

const PodModalContext = createContext<PodModalContextType | undefined>(undefined);

export const usePodModal = () => {
  const context = useContext(PodModalContext);
  if (context === undefined) {
    throw new Error('usePodModal must be used within a PodModalProvider');
  }
  return context;
};

interface PodModalProviderProps {
  children: ReactNode;
}

export const PodModalProvider: React.FC<PodModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Keeps the current listener (if any)
  const [onPodCreated, setOnPodCreatedState] = useState<PodCreatedListener | null>(null);
  // Buffer of pods created before a listener is registered (e.g. when user creates
  // a pod from another page before the Pods grid has mounted).
  const [, setPendingPods] = useState<Pod[]>([]);
  const [newPodData, setNewPodData] = useState<NewPodData>({
    title: '',
    content: '',
    stage: 'seed',
    tags: '',
    version: '1.0.0',
    isPublic: false
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  const openModal = () => {
    setIsOpen(true);
    document.body.classList.add('overflow-hidden');
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.classList.remove('overflow-hidden');
    setNewPodData({
      title: '',
      content: '',
      stage: 'seed',
      tags: '',
      version: '1.0.0',
      isPublic: false
    });
  };

  const handleCreatePod = async () => {
    if (!newPodData.title.trim() || !newPodData.content.trim()) return;

    // Map UI stage → backend stage value
    const uiToApiStage: Record<string, string> = {
      seed: 'idea',
      sprout: 'draft',
      bloom: 'review',
      fruit: 'final',
    };

    const payload = {
      title: newPodData.title.trim(),
      content: newPodData.content.trim(),
      stage: uiToApiStage[newPodData.stage],
      is_public: newPodData.isPublic,
      tags: newPodData.tags
        .split(',')
        .map(name => name.trim())
        .filter(Boolean)
        .map(name => ({ name })),
    };

    const res = await api.post('/pods/', payload);

    // --------------------------------------------------
    // Inform listeners so current Pods list refreshes.
    // --------------------------------------------------
    if (res && res.data) {
      interface BackendTag { id: number; name: string; }
      interface BackendPod {
        id: number;
        title: string;
        content: string;
        stage: string;
        is_public: boolean;
        tags?: BackendTag[];
        version?: string;
      }

      const backendPod = res.data as BackendPod;

      // Map backend stage → UI stage again
      const mapStage = (backendStage: string): PodStage => {
        switch (backendStage) {
          case 'idea': return 'seed';
          case 'draft': return 'sprout';
          case 'review': return 'bloom';
          case 'final': return 'fruit';
          default: return 'seed';
        }
      };

      const uiStage = mapStage(backendPod.stage);

      const stageIndex = STAGES.indexOf(uiStage);
      const progress = ((stageIndex + 1) / STAGES.length) * 100;

      const uiPod = {
        id: backendPod.id,
        title: backendPod.title,
        content: backendPod.content,
        stage: uiStage,
        progress,
        lastUpdated: 'just now',
        isPublic: backendPod.is_public,
        tags: (backendPod.tags || []).map((t: BackendTag) => t.name),
        version: backendPod.version?.toString() || '1.0.0',
        stageProgress: stageIndex + 1,
        currentStageContent: {
          seed: '',
          sprout: '',
          bloom: '',
          fruit: '',
          [uiStage]: backendPod.content,
        },
        timeline: [],
        comments: [],
      } as Pod; // cast to local interface Pod

      if (onPodCreated) {
        onPodCreated(uiPod);
      } else {
        // No listener registered yet – store it so it can be replayed later.
        setPendingPods(prev => [...prev, uiPod]);
      }
    }

    closeModal();

    // Navigate to pods page if we aren't already there
    if (location.pathname !== '/pods') {
      navigate('/pods');
    }
  };

  // Custom setter that flushes any buffered pods to the newly-registered listener.
  const setOnPodCreated = React.useCallback((callback: PodCreatedListener | null) => {
    setOnPodCreatedState(() => callback);
    if (!callback) return;

    // Flush any pods that were created before the listener was registered.
    setPendingPods(prev => {
      if (prev.length) {
        prev.forEach(pod => callback(pod));
      }
      return [];
    });
  }, []);

  const value: PodModalContextType = {
    isOpen,
    openModal,
    closeModal,
    newPodData,
    setNewPodData,
    handleCreatePod,
    onPodCreated,
    setOnPodCreated,
  };

  return (
    <PodModalContext.Provider value={value}>
      {children}
    </PodModalContext.Provider>
  );
};