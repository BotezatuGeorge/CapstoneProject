import { Add, Subtract } from '@carbon/icons-react';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, min = 1, max = 99, onChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center w-36 border-b border-helper">
      <span className="flex-1 px-4 py-3 text-sm text-[#f4f4f4]">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="px-3 py-3 text-muted hover:bg-surface-overlay hover:text-white disabled:opacity-40 transition-colors"
        aria-label="Decrease quantity"
      >
        <Subtract size={16} />
      </button>
      <span className="h-4 w-px bg-helper" aria-hidden="true" />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="px-3 py-3 text-muted hover:bg-surface-overlay hover:text-white disabled:opacity-40 transition-colors"
        aria-label="Increase quantity"
      >
        <Add size={16} />
      </button>
    </div>
  );
}
