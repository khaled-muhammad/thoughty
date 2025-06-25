import { useState, useEffect, useCallback } from 'react';
import { type Pod, type PodStage, type Comment, type TimelineStatus, STAGES } from '../types/pods';
import { usePodModal } from '../contexts/PodModalContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export function usePods() {
  const { user } = useAuth();

  const [pods, setPods] = useState<Pod[]>([]);
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null);
  const [currentStage, setCurrentStage] = useState<PodStage>('seed');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState<string>('All Stages');

  const { setOnPodCreated } = usePodModal();

  /* -------------------------------------------------
   * Helpers
   * ------------------------------------------------*/

  /**
   * Format an ISO date-time string into "x units ago".
   */
  const formatTimeAgo = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    //   [factor, unit]
    const intervals: [number, string][] = [
      [60, 'second'],
      [60, 'minute'],
      [24, 'hour'],
      [7, 'day'],
      [4.34524, 'week'],
      [12, 'month'],
      [Number.MAX_SAFE_INTEGER, 'year']
    ];

    let i = 0;
    let count = seconds;
    while (count >= intervals[i][0] && i < intervals.length - 1) {
      count = Math.floor(count / intervals[i][0]);
      i++;
    }
    const unit = intervals[i][1];
    return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
  };

  /**
   * Convert backend Pod shape → frontend Pod shape
   */
  interface BackendTag { id: number; name: string; }
  interface BackendPod {
    id: number;
    user: number;
    title: string;
    content: string;
    stage: PodStage;
    version: number;
    is_public: boolean;
    tags: BackendTag[];
    created_at: string;
    timestamp: string;
  }

  const transformBackendPod = (data: BackendPod): Pod => {
    // Map backend stage (idea/draft/review/final) → UI stage (seed/sprout/bloom/fruit)
    const mapStage = (backendStage: string): PodStage => {
      switch (backendStage) {
        case 'idea':
          return 'seed';
        case 'draft':
          return 'sprout';
        case 'review':
          return 'bloom';
        case 'final':
          return 'fruit';
        default:
          return 'seed';
      }
    };

    const uiStage = mapStage(data.stage as string);

    const stageIndex = STAGES.indexOf(uiStage);
    const progress = ((stageIndex + 1) / STAGES.length) * 100;

    const timeline = STAGES.map((stage) => {
      let status: TimelineStatus = 'pending';
      if (stageIndex > STAGES.indexOf(stage)) {
        status = 'completed';
      } else if (stage === uiStage) {
        status = 'current';
      }

      return {
        stage,
        status,
        completedDate: status === 'completed' ? formatTimeAgo(data.timestamp) : undefined,
        startedDate: status === 'current' ? formatTimeAgo(data.timestamp) : undefined,
      };
    });

    const currentStageContent: Record<string, string> = {
      seed: '',
      sprout: '',
      bloom: '',
      fruit: '',
    };
    currentStageContent[uiStage] = data.content;

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      stage: uiStage,
      progress,
      lastUpdated: formatTimeAgo(data.timestamp),
      timeline,
      comments: [],
      isPublic: data.is_public,
      tags: (data.tags || []).map((t) => t.name),
      version: data.version?.toString() || '1.0.0',
      stageProgress: stageIndex + 1,
      currentStageContent,
    };
  };

  // Register callback for global pod creation
  useEffect(() => {
    setOnPodCreated((newPod: Pod) => {
      if (!newPod) return; // Runtime safeguard – should never hit.

      console.log('New pod created:', newPod);

      const safePod: Pod = {
        ...newPod,
        comments: newPod.comments || [],
        timeline: newPod.timeline || [],
        tags: newPod.tags || [],
        currentStageContent: newPod.currentStageContent || {}
      };
      setPods(prevPods => [safePod, ...prevPods]);
    });
  }, [setOnPodCreated]);

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

  /* -------------------------------------------------
   * Fetch user pods from backend
   * ------------------------------------------------*/

  useEffect(() => {
    const fetchUserPods = async () => {
      if (!user) {
        setPods([]);
        return;
      }

      try {
        const response = await api.get('/pods/mine/');
        const backendPods: BackendPod[] = response.data || [];
        const transformed = backendPods.map(transformBackendPod);
        setPods(transformed);
      } catch (error) {
        console.error('Failed to load pods:', error);
      }
    };

    fetchUserPods();
  }, [user]);

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