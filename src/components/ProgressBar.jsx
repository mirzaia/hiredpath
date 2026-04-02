// ProgressBar — linear and circular variants
// Usage: <ProgressBar pct={75} color="#6366f1" />
// Usage: <ProgressBar variant="circular" pct={75} size={80} color="#6366f1" />

export default function ProgressBar({ pct = 0, color = '#f97316', variant = 'linear', size = 72, strokeWidth = 6, label }) {
  const clampedPct = Math.min(100, Math.max(0, pct))

  if (variant === 'circular') {
    const radius = (size - strokeWidth * 2) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (clampedPct / 100) * circumference

    return (
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
          <span className={`font-bold text-slate-900 leading-none ${size > 60 ? 'text-lg' : 'text-xs'}`}>
            {clampedPct}%
          </span>
          {label && <span className="text-[0.6rem] text-slate-500 leading-none">{label}</span>}
        </div>
      </div>
    )
  }

  return (
    <div>
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500">{label}</span>
          <span className="text-xs font-bold text-slate-900">{clampedPct}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedPct}%`, background: color }}
        />
      </div>
    </div>
  )
}
