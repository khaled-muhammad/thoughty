import { useState, useEffect, useCallback } from 'react';
import { type Pod, type PodStage, type Comment, STAGES } from '../types/pods';
import { usePodModal } from '../contexts/PodModalContext';

// Mock data - this would typically come from an API
const INITIAL_PODS: Pod[] = [
  {
    id: 1,
    title: "Product Launch Strategy",
    content: "Our product launch is progressing well...",
    stage: "bloom",
    progress: 75,
    lastUpdated: "2 hours ago",
    isPublic: true,
    tags: ["marketing", "product", "launch"],
    version: "1.2.0",
    stageProgress: 3,
    currentStageContent: {
      seed: "Initial product concept and market research completed.",
      sprout: "Feature development and MVP testing finished.",
      bloom: "Marketing strategy development and partnerships in progress...",
      fruit: "Launch preparation and final testing."
    },
    timeline: [
      { stage: 'fruit', status: 'pending' },
      { stage: 'bloom', status: 'current', startedDate: '1 week ago' },
      { stage: 'sprout', status: 'completed', completedDate: '2 weeks ago' },
      { stage: 'seed', status: 'completed', completedDate: '4 weeks ago' }
    ],
    comments: [
      {
        id: 1,
        author: "Alex Johnson",
        content: "Have we considered partnering with tech bloggers for early reviews?",
        timestamp: "2 days ago",
        reactions: [
          { emoji: "👍", count: 2, userReacted: false },
          { emoji: "❤️", count: 1, userReacted: false },
          { emoji: "😮", count: 0, userReacted: false }
        ]
      },
      {
        id: 2,
        author: "Maria Garcia",
        content: "I suggest we add a FAQ section to the support materials to reduce initial support load.",
        timestamp: "1 day ago",
        reactions: [
          { emoji: "👍", count: 3, userReacted: false },
          { emoji: "❤️", count: 2, userReacted: false }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Marketing Campaign",
    content: "Developing comprehensive marketing strategy...",
    stage: "sprout",
    progress: 50,
    lastUpdated: "1 day ago",
    isPublic: false,
    tags: ["marketing", "campaign"],
    version: "1.0.0",
    stageProgress: 2,
    currentStageContent: {
      seed: "Campaign concept and target audience defined.",
      sprout: "Creative assets development in progress...",
      bloom: "Campaign execution and optimization.",
      fruit: "Results analysis and reporting."
    },
    timeline: [
      { stage: 'fruit', status: 'pending' },
      { stage: 'bloom', status: 'pending' },
      { stage: 'sprout', status: 'current', startedDate: '3 days ago' },
      { stage: 'seed', status: 'completed', completedDate: '1 week ago' }
    ],
    comments: []
  },
  {
    id: 3,
    title: "Team Building Workshop",
    content: "Workshop planning and execution completed...",
    stage: "fruit",
    progress: 100,
    lastUpdated: "1 week ago",
    isPublic: true,
    tags: ["team", "workshop", "hr"],
    version: "2.0.0",
    stageProgress: 4,
    currentStageContent: {
      seed: "Workshop objectives and format decided.",
      sprout: "Activities planned and materials prepared.",
      bloom: "Workshop executed successfully.",
      fruit: "Feedback collected and follow-up actions planned."
    },
    timeline: [
      { stage: 'fruit', status: 'completed', completedDate: '1 week ago' },
      { stage: 'bloom', status: 'completed', completedDate: '2 weeks ago' },
      { stage: 'sprout', status: 'completed', completedDate: '3 weeks ago' },
      { stage: 'seed', status: 'completed', completedDate: '1 month ago' }
    ],
    comments: []
  },
  {
    id: 4,
    title: "New Feature Ideas",
    content: "Brainstorming and initial concept development...",
    stage: "seed",
    progress: 25,
    lastUpdated: "3 days ago",
    isPublic: false,
    tags: ["features", "brainstorming"],
    version: "0.1.0",
    stageProgress: 1,
    currentStageContent: {
      seed: "Initial feature concepts and user research in progress...",
      sprout: "Feature specification and design planning.",
      bloom: "Development and testing.",
      fruit: "Feature launch and user feedback."
    },
    timeline: [
      { stage: 'fruit', status: 'pending' },
      { stage: 'bloom', status: 'pending' },
      { stage: 'sprout', status: 'pending' },
      { stage: 'seed', status: 'current', startedDate: '1 week ago' }
    ],
    comments: []
  }
];

export function usePods() {
  const [pods, setPods] = useState<Pod[]>(INITIAL_PODS);
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null);
  const [currentStage, setCurrentStage] = useState<PodStage>('seed');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState<string>('All Stages');

  const { setOnPodCreated } = usePodModal();

  // Register callback for global pod creation
  useEffect(() => {
    setOnPodCreated((newPod: Pod) => {
      if (newPod == null) {
        return;
      }
      
      const safePod: Pod = {
        ...newPod,
        comments: newPod.comments || [],
        timeline: newPod.timeline || [],
        tags: newPod.tags || [],
        currentStageContent: newPod.currentStageContent || {}
      };
      setPods(prevPods => [safePod, ...prevPods]);
    });
  }, []);

  // Modal management
  useEffect(() => {
    if (isDetailModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isDetailModalOpen]);

  // Load emoji reactions from localStorage
  useEffect(() => {
    setPods(prevPods => prevPods.map(pod => ({
      ...pod,
      comments: (pod.comments || []).map(comment => ({
        ...comment,
        reactions: (comment.reactions || []).map(reaction => {
          const storageKey = `pod-${pod.id}-comment-${comment.id}-${reaction.emoji}`;
          const userReacted = localStorage.getItem(storageKey) === 'true';
          return {
            ...reaction,
            userReacted
          };
        })
      }))
    })));
  }, []);

  // Event handlers
  const openPodDetail = useCallback((pod: Pod) => {
    setSelectedPod(pod);
    setCurrentStage(pod.stage);
    setIsDetailModalOpen(true);
  }, []);

  const closePodDetail = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedPod(null);
  }, []);

  const handleStageChange = useCallback((stage: PodStage) => {
    setCurrentStage(stage);
  }, []);

  const handleEmojiReaction = useCallback((podId: number, commentId: number, emoji: string) => {
    setPods(prevPods => prevPods.map(pod => {
      if (pod.id === podId && pod.comments) {
        const updatedPod = {
          ...pod,
          comments: (pod.comments || []).map(comment => {
            if (comment.id === commentId && comment.reactions) {
              return {
                ...comment,
                reactions: (comment.reactions || []).map(reaction => {
                  if (reaction.emoji === emoji) {
                    const newUserReacted = !reaction.userReacted;
                    const newCount = newUserReacted ? reaction.count + 1 : Math.max(0, reaction.count - 1);
                    
                    const storageKey = `pod-${podId}-comment-${commentId}-${emoji}`;
                    if (newUserReacted) {
                      localStorage.setItem(storageKey, 'true');
                    } else {
                      localStorage.removeItem(storageKey);
                    }
                    
                    return {
                      ...reaction,
                      count: newCount,
                      userReacted: newUserReacted
                    };
                  }
                  return reaction;
                })
              };
            }
            return comment;
          })
        };
        
        if (selectedPod && selectedPod.id === podId) {
          setSelectedPod(updatedPod);
        }
        
        return updatedPod;
      }
      return pod;
    }));
  }, [selectedPod]);

  const handleAddComment = useCallback((commentText: string) => {
    if (!selectedPod || !commentText.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now(),
      author: "Current User",
      content: commentText.trim(),
      timestamp: "just now",
      reactions: [
        { emoji: "👍", count: 0, userReacted: false },
        { emoji: "❤️", count: 0, userReacted: false },
        { emoji: "😮", count: 0, userReacted: false }
      ]
    };

    setPods(prevPods => prevPods.map(pod => {
      if (pod.id === selectedPod.id) {
        return {
          ...pod,
          comments: [...(pod.comments || []), newCommentObj]
        };
      }
      return pod;
    }));

    setSelectedPod(prev => prev ? { 
      ...prev, 
      comments: [...(prev.comments || []), newCommentObj] 
    } : null);
  }, [selectedPod]);

  const handleSaveDraft = useCallback((content: string) => {
    if (!selectedPod) return;

    setPods(prevPods => prevPods.map(pod => {
      if (pod.id === selectedPod.id) {
        return {
          ...pod,
          currentStageContent: {
            ...pod.currentStageContent,
            [currentStage]: content
          },
          lastUpdated: 'just now'
        };
      }
      return pod;
    }));

    console.log('Draft saved successfully');
  }, [selectedPod, currentStage]);

  const handleNextStage = useCallback(() => {
    if (!selectedPod) return;

    const currentIndex = STAGES.indexOf(selectedPod.stage);
    
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      const newProgress = Math.min(100, ((currentIndex + 2) / STAGES.length) * 100);
      
      setPods(prevPods => prevPods.map(pod => {
        if (pod.id === selectedPod.id) {
          return {
            ...pod,
            stage: nextStage,
            progress: newProgress,
            stageProgress: currentIndex + 2,
            timeline: pod.timeline.map(item => {
              if (item.stage === selectedPod.stage) {
                return { ...item, status: 'completed' as const, completedDate: 'just now' };
              }
              if (item.stage === nextStage) {
                return { ...item, status: 'current' as const, startedDate: 'just now' };
              }
              return item;
            })
          };
        }
        return pod;
      }));

      setSelectedPod(prev => prev ? { ...prev, stage: nextStage } : null);
      setCurrentStage(nextStage);
    }
  }, [selectedPod]);

  return {
    // State
    pods,
    selectedPod,
    currentStage,
    isDetailModalOpen,
    stageFilter,
    
    // Actions
    setStageFilter,
    openPodDetail,
    closePodDetail,
    handleStageChange,
    handleEmojiReaction,
    handleAddComment,
    handleSaveDraft,
    handleNextStage
  };
} 