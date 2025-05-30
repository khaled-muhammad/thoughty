import { usePods } from '../hooks/usePods';
import { 
  PodControlBar, 
  PodsGrid, 
  PodDetailModal 
} from '../components/pods';
import "../styles/pods.css";

export default function Pods() {
  const {
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
  } = usePods();

  return (
    <div id="pods" className="page container mx-auto px-4 py-24">
      {/* Control Bar */}
      <PodControlBar 
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
      />

      {/* Pod Listing - Grid View */}
      <PodsGrid 
        pods={pods}
        stageFilter={stageFilter}
        onOpenDetail={openPodDetail}
      />

      {/* Pod Detail Modal */}
      <PodDetailModal
        selectedPod={selectedPod!}
        currentStage={currentStage}
        isOpen={isDetailModalOpen}
        onClose={closePodDetail}
        onStageChange={handleStageChange}
        onSaveDraft={handleSaveDraft}
        onNextStage={handleNextStage}
        onEmojiReaction={handleEmojiReaction}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
