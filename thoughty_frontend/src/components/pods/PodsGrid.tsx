import type { Pod } from '../../types/pods';
import PodCard from './PodCard';

interface PodsGridProps {
  pods: Pod[];
  stageFilter: string;
  onOpenDetail: (pod: Pod) => void;
}

export default function PodsGrid({ pods, stageFilter, onOpenDetail }: PodsGridProps) {
  const filteredPods = (pods || []).filter(pod => 
    stageFilter === 'All Stages' || (pod && pod.stage && pod.stage.toLowerCase() === stageFilter.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPods.map((pod) => (
        <PodCard 
          key={pod.id} 
          pod={pod} 
          onOpenDetail={onOpenDetail} 
        />
      ))}
    </div>
  );
}