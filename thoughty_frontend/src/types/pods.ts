// TypeScript interfaces and types for Pod functionality

export interface EmojiReaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  reactions: EmojiReaction[];
}

export type PodStage = 'seed' | 'sprout' | 'bloom' | 'fruit';
export type TimelineStatus = 'completed' | 'current' | 'pending';

export interface TimelineItem {
  stage: PodStage;
  status: TimelineStatus;
  completedDate?: string;
  startedDate?: string;
}

export interface Pod {
  id: number;
  title: string;
  content: string;
  stage: PodStage;
  progress: number;
  lastUpdated: string;
  timeline: TimelineItem[];
  comments: Comment[];
  isPublic: boolean;
  tags: string[];
  version: string;
  stageProgress: number;
  currentStageContent: Record<string, string>;
}

// Constants
export const STAGES: PodStage[] = ['seed', 'sprout', 'bloom', 'fruit'];
export const STAGE_FILTER_OPTIONS = ['All Stages', 'Seed', 'Sprout', 'Bloom', 'Fruit']; 