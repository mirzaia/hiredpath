// ProgressBar — linear and circular variants
// Usage: <ProgressBar pct={75} color="#6366f1" />
// Usage: <ProgressBar variant="circular" pct={75} size={80} color="#6366f1" />

export default function ProgressBar({ pct = 0, color = 'var(--accent-primary)', variant = 'linear', size = 72, strokeWidth = 6, label }) {
  const clampedPct = Math.min(100, Math.max(0, pct))

  if (variant === 'circular') {
    const radius = (size - strokeWidth * 2) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (clampedPct / 100) * circumference

    return (
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
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
            style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 1
        }}>
          <span style={{ fontSize: size > 60 ? '1.1rem' : '0.75rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            {clampedPct}%
          </span>
          {label && <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1 }}>{label}</span>}
        </div>
      </div>
    )
  }

  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{clampedPct}%</span>
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${clampedPct}%`, background: color }}
        />
      </div>
    </div>
  )
}
