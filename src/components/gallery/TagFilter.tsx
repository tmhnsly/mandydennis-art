interface Props {
  availableTags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

export default function TagFilter({ availableTags, activeTags, onToggle, onClear }: Props) {
  if (availableTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeTags.length > 0 && (
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-full text-sm font-medium bg-warm-800 text-white hover:bg-warm-700 transition-colors"
        >
          Clear all
        </button>
      )}
      {availableTags.map((tag) => {
        const isActive = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              isActive
                ? "bg-warm-700 text-white"
                : "bg-warm-200 text-warm-700 hover:bg-warm-300"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
