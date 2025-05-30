import type { Pod, PodStage } from '../../types/pods';

interface PodCardProps {
  pod: Pod;
  onOpenDetail: (pod: Pod) => void;
}

export default function PodCard({ pod, onOpenDetail }: PodCardProps) {
  const getStageColor = (stage: PodStage) => {
    switch (stage) {
      case 'seed': return 'stage-seed';
      case 'sprout': return 'stage-sprout';
      case 'bloom': return 'stage-bloom';
      case 'fruit': return 'stage-fruit';
      default: return 'stage-seed';
    }
  };

  const capitalizeStage = (stage: PodStage) => {
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  return (
    <div 
      className="pod-card p-3 cursor-pointer" 
      data-pod-id={pod.id}
      onClick={() => onOpenDetail(pod)}
    >
      <div className="flex justify-between items-start mb-2">
        <h5 className="text-lg font-medium">{pod.title}</h5>
        <span className={`stage-badge ${getStageColor(pod.stage)}`}>
          {capitalizeStage(pod.stage)}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-3">
        Last updated: {pod.lastUpdated}
      </p>
      <div className="h-2 bg-dark rounded overflow-hidden mb-3">
        <div 
          className="bg-primary h-full transition-all duration-300" 
          style={{ width: `${pod.progress}%` }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400 text-sm">
          {pod.stageProgress}/4 stages
        </span>
        <button 
          className="bg-primary hover:bg-primary-light text-white font-medium py-1 px-3 rounded text-sm transition"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(pod);
          }}
        >
          Open
        </button>
      </div>
    </div>
  );
}