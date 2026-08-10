"use client";

interface Props {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  // Rendered next to the label, mono — e.g. "6:00 a. m." or "35 %".
  display: string;
}

// Labeled, thumb-friendly slider. The 44px hit area lives in globals.css.
export function Slider({ label, min, max, step = 1, value, onChange, display }: Props) {
  return (
    <label className="flex flex-col gap-1 w-full">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-label text-muted">{label}</span>
        <span className="text-metric text-accent">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
