import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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
  timeline: any[];
  comments: any[];
  isPublic: boolean;
  tags: string[];
  version: string;
  stageProgress: number;
  currentStageContent: { [key: string]: string };
}

interface PodModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  newPodData: NewPodData;
  setNewPodData: React.Dispatch<React.SetStateAction<NewPodData>>;
  handleCreatePod: () => void;
  onPodCreated: ((pod: Pod) => void) | null;
  setOnPodCreated: (callback: ((pod: Pod) => void) | null) => void;
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
  const [onPodCreated, setOnPodCreated] = useState<((pod: Pod) => void) | null>(null);
  const [newPodData, setNewPodData] = useState<NewPodData>({
    title: '',
    content: '',
    stage: 'seed',
    tags: '',
    version: '1.0.0',
    isPublic: false
  });
  
  const navigate = useNavigate();

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

  const handleCreatePod = () => {
    if (!newPodData.title.trim() || !newPodData.content.trim()) return;

    // Create the new pod object
    const newPod: Pod = {
      id: Date.now(),
      title: newPodData.title,
      content: newPodData.content,
      stage: newPodData.stage,
      progress: 25,
      lastUpdated: 'just now',
      isPublic: newPodData.isPublic,
      tags: newPodData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      version: newPodData.version,
      stageProgress: 1,
      currentStageContent: {
        [newPodData.stage]: newPodData.content,
        seed: '',
        sprout: '',
        bloom: '',
        fruit: ''
      },
      timeline: [
        { stage: 'fruit', status: 'pending' },
        { stage: 'bloom', status: 'pending' },
        { stage: 'sprout', status: 'pending' },
        { stage: 'seed', status: 'current', startedDate: 'just now' }
      ],
      comments: []
    };

    newPod.currentStageContent[newPodData.stage] = newPodData.content;

    // Call the callback if it exists (for local state updates)
    if (onPodCreated) {
      onPodCreated(newPod);
    }
    
    console.log('Pod created:', newPod);
    
    closeModal();
    
    // Navigate to pods page after successful creation
    navigate('/pods');
    
    // Show success message (you can implement a toast system later)
    // toast.success('Pod created successfully!');
  };

  const value: PodModalContextType = {
    isOpen,
    openModal,
    closeModal,
    newPodData,
    setNewPodData,
    handleCreatePod,
    onPodCreated,
    setOnPodCreated
  };

  return (
    <PodModalContext.Provider value={value}>
      {children}
    </PodModalContext.Provider>
  );
};