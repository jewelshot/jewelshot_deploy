'use client';

interface SelectiveCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function SelectiveCard({
  id,
  name,
  description,
  image,
  isSelected,
  onSelect,
}: SelectiveCardProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`group relative overflow-hidden rounded-lg border transition-all duration-300 ${
        isSelected
          ? 'border-purple-500/60 bg-purple-500/10 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
          : 'border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]'
      }`}
    >
      {/* Image */}
      <div className="relative h-16 w-full overflow-hidden bg-black/20">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-90"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-selective.svg';
          }}
        />
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute right-1 top-1 rounded-full bg-purple-500 p-0.5">
            <svg
              className="h-2.5 w-2.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2">
        <h4
          className={`text-[10px] font-semibold transition-colors ${
            isSelected
              ? 'text-purple-300'
              : 'text-white/90 group-hover:text-white'
          }`}
        >
          {name}
        </h4>
        <p
          className={`text-[8px] transition-colors ${
            isSelected
              ? 'text-purple-400/70'
              : 'text-white/50 group-hover:text-white/60'
          }`}
        >
          {description}
        </p>
      </div>
    </button>
  );
}
