import { Star, X } from "lucide-react";

interface Props {
  availableTags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
  showFeatured?: boolean;
  featuredActive?: boolean;
  onToggleFeatured?: () => void;
}

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
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-[0.78rem] font-medium border transition-colors ${
            featuredActive
              ? "bg-text border-text text-bg"
              : "border-line-strong text-text-muted hover:border-text hover:text-text"
          }`}
        >
          <Star size={14} className={featuredActive ? "fill-current" : ""} />
          Featured
        </button>
      )}
      {activeTags.length > 0 && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[0.78rem] font-medium bg-text border border-text text-bg transition-colors"
        >
          <X size={14} />
          Clear
        </button>
      )}
      {availableTags.map((tag) => {
        const isActive = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`px-3.5 py-2 text-[0.78rem] font-medium border capitalize transition-colors ${
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
