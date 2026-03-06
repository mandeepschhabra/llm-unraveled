interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  unit?: string
}

export default function SliderControl({
  label, value, min, max, step = 1, onChange, unit = '',
}: SliderControlProps) {
  return (
    <div className="flex flex-col gap-1 w-full max-w-xs">
      <div className="flex justify-between text-sm">
        <span className="text-text-muted">{label}</span>
        <span className="text-neon-cyan font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
          bg-void-lighter
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-neon-cyan
          [&::-webkit-slider-thumb]:shadow-[0_0_8px_#00f0ff66]
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  )
}
