import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faSave, 
  faComments, 
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { type Pod, type PodStage, STAGES } from '../../types/pods';
import PodTimeline from './PodTimeline';
import PodComments from './PodComments';

interface PodDetailModalProps {
  selectedPod: Pod;
  currentStage: PodStage;
  isOpen: boolean;
  onClose: () => void;
  onStageChange: (stage: PodStage) => void;
  onSaveDraft: (content: string) => void;
  onNextStage: () => void;
  onEmojiReaction: (podId: number, commentId: number, emoji: string) => void;
  onAddComment: (comment: string) => void;
}

export default function PodDetailModal({
  selectedPod,
  currentStage,
  isOpen,
  onClose,
  onStageChange,
  onSaveDraft,
  onNextStage,
  onEmojiReaction,
  onAddComment
}: PodDetailModalProps) {
  const podContentRef = useRef<HTMLDivElement>(null);

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

  const handleSaveDraft = () => {
    if (!podContentRef.current) return;
    const updatedContent = podContentRef.current.textContent || '';
    onSaveDraft(updatedContent);
  };

  if (!isOpen || !selectedPod) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div
          className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-md transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-card-bg/90 backdrop-filter backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl transform transition-all max-w-4xl w-full border border-white/10">
          {/* Modal Header */}
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center">
              <h5 className="text-xl font-semibold text-light">{selectedPod.title}</h5>
              <span className={`stage-badge ${getStageColor(selectedPod.stage)} ml-3 px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
                {capitalizeStage(selectedPod.stage)}
              </span>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-8 bg-gradient-to-br from-card-bg/50 to-card-bg/80">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                {/* Stage Navigation */}
                <div className="flex mb-6 space-x-3 overflow-x-auto bg-dark/30 p-2 rounded-xl backdrop-blur-sm">
                  {STAGES.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => onStageChange(stage)}
                      className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium whitespace-nowrap ${
                        currentStage === stage
                          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg transform scale-105'
                          : 'bg-white/5 text-light hover:bg-white/10 hover:scale-102'
                      }`}
                    >
                      {capitalizeStage(stage)}
                    </button>
                  ))}
                </div>

                {/* Current Stage Content */}
                <div 
                  ref={podContentRef}
                  className="pod-content mb-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                >
                  {selectedPod.currentStageContent[currentStage] || `Content for ${currentStage} stage...`}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mb-6 flex-wrap gap-4">
                  <button 
                    onClick={handleSaveDraft}
                    className="border border-white/20 text-light hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-300 flex items-center backdrop-blur-sm hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Save Draft
                  </button>
                  <div className="flex space-x-3">
                    <button className="border border-secondary/50 text-secondary hover:bg-secondary hover:text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center backdrop-blur-sm hover:scale-105">
                      <FontAwesomeIcon icon={faComments} className="mr-2" />
                      Request Feedback
                    </button>
                    {selectedPod.stage !== 'fruit' && (
                      <button 
                        onClick={onNextStage}
                        className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center shadow-lg hover:scale-105 hover:shadow-xl"
                      >
                        <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
                        Next Stage
                      </button>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                <PodComments 
                  selectedPod={selectedPod}
                  onEmojiReaction={onEmojiReaction}
                  onAddComment={onAddComment}
                />
              </div>

              {/* Timeline Sidebar */}
              <PodTimeline 
                selectedPod={selectedPod}
                onStageChange={onStageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}