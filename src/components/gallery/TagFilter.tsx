import { FaStar, FaTimes } from "react-icons/fa";

interface Props {
  availableTags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
  showFeatured?: boolean;
  featuredActive?: boolean;
  onToggleFeatured?: () => void;
}

const TAG_BASE = "inline-flex items-center justify-center gap-1.5 min-h-11 px-4 text-[0.8rem] font-medium border transition-colors";

export default function TagFilter({
  availableTags,
  activeTags,
  onToggle,
  onClear,
  showFeatured,
  featuredActive,
  onToggleFeatured,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
      {showFeatured && onToggleFeatured && (
        <button
          onClick={onToggleFeatured}
          className={`${TAG_BASE} ${
            featuredActive
              ? "bg-text border-text text-bg"
              : "border-line-strong text-text-muted hover:border-text hover:text-text"
          }`}
        >
          <FaStar size={13} />
          Featured
        </button>
      )}
      {activeTags.length > 0 && (
        <button
          onClick={onClear}
          className={`${TAG_BASE} bg-text border-text text-bg`}
        >
          <FaTimes size={13} />
          Clear
        </button>
      )}
      {availableTags.map((tag) => {
        const isActive = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`${TAG_BASE} capitalize ${
              isActive
                ? "bg-text border-text text-bg"
                : "border-line-strong text-text-muted hover:border-text hover:text-text"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
