import React from 'react';
import { X } from 'lucide-react';

interface SkillTagProps {
  name: string;
  variant?: 'offered' | 'required' | 'neutral' | 'highlight';
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const SkillTag: React.FC<SkillTagProps> = ({
  name,
  variant = 'neutral',
  onRemove,
  size = 'md',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'offered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'required':
        return 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100';
      case 'highlight':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2.5 py-0.5';
      case 'lg':
        return 'text-sm px-3.5 py-1.5 font-medium';
      default:
        return 'text-xs px-3 py-1 font-medium';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${getVariantStyles()} ${getSizeStyles()}`}
    >
      <span>{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
          title="Remove skill"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
