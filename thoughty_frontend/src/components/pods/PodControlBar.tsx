import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { usePodModal } from "../../contexts/PodModalContext";
import { STAGE_FILTER_OPTIONS } from "../../types/pods";

interface PodControlBarProps {
  stageFilter: string;
  onStageFilterChange: (filter: string) => void;
}

export default function PodControlBar({
  stageFilter,
  onStageFilterChange,
}: PodControlBarProps) {
  const { openModal } = usePodModal();

  return (
    <div className="flex mb-4 p-2 rounded bg-card-bg border border-input-br">
      <div>
        <button
          onClick={openModal}
          className="bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded transition"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          New Pod
        </button>
      </div>
      <div className="ml-auto">
        <select
          value={stageFilter}
          onChange={(e) => onStageFilterChange(e.target.value)}
          className="bg-input-bg text-light border border-input-br rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {STAGE_FILTER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
