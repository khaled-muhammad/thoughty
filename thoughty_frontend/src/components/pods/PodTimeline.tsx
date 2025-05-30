import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faClock } from '@fortawesome/free-solid-svg-icons';
import type { Pod, PodStage, TimelineStatus } from '../../types/pods';

interface PodTimelineProps {
  selectedPod: Pod;
  onStageChange: (stage: PodStage) => void;
}

export default function PodTimeline({ selectedPod, onStageChange }: PodTimelineProps) {
  const getStageIcon = (status: TimelineStatus) => {
    switch (status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'current':
        return <FontAwesomeIcon icon={faSpinner} className="text-primary" />;
      default:
        return <FontAwesomeIcon icon={faClock} className="text-gray-400" />;
    }
  };

  const capitalizeStage = (stage: PodStage) => {
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  return (
    <div className="md:w-1/3">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden mb-6 shadow-lg">
        <div className="border-b border-white/10 px-6 py-4 bg-gradient-to-r from-primary/20 to-accent/20">
          <h6 className="font-semibold text-light">Evolution Timeline</h6>
        </div>
        <div className="p-6">
          <div className="timeline space-y-4">
            {(selectedPod.timeline || []).map((item) => (
              <div 
                key={item.stage}
                className={`timeline-item p-4 rounded-lg transition-all duration-300 ${
                  item.status === 'current' 
                    ? 'active bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <h6 className="font-semibold mb-2 text-light">
                  {capitalizeStage(item.stage)} Stage
                </h6>
                <small className="text-gray-400 block mb-3">
                  {item.status === 'completed' && item.completedDate && `Completed ${item.completedDate}`}
                  {item.status === 'current' && item.startedDate && `Current - Started ${item.startedDate}`}
                  {item.status === 'pending' && 'Not started'}
                </small>
                {item.status !== 'pending' && (
                  <button 
                    onClick={() => onStageChange(item.stage)}
                    className="bg-gradient-to-r from-primary to-accent text-white text-sm px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg">
        <div className="border-b border-white/10 px-6 py-4 bg-gradient-to-r from-secondary/20 to-primary/20">
          <h6 className="font-semibold text-light">Progress</h6>
        </div>
        <div className="p-6">
          <div className="h-3 bg-dark/50 rounded-full overflow-hidden mb-4 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${selectedPod.progress}%` }}
            />
          </div>
          <div className="space-y-3">
            {(selectedPod.timeline || []).map((item) => (
              <div key={item.stage} className="flex justify-between items-center">
                <small className="text-light font-medium">{capitalizeStage(item.stage)}</small>
                <small className="flex items-center space-x-2">
                  {getStageIcon(item.status)}
                  <span className={`${
                    item.status === 'completed' ? 'text-green-400' :
                    item.status === 'current' ? 'text-primary' : 'text-gray-400'
                  }`}>
                    {item.status === 'completed' && 'Complete'}
                    {item.status === 'current' && 'In Progress'}
                    {item.status === 'pending' && 'Pending'}
                  </span>
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}