import { useState } from 'react'

const LABELS = ['', 'Beginner', 'Basic', 'Comfortable', 'Confident', 'Expert']
const COLORS = ['', '#ef4444', '#f59e0b', '#eab308', '#10b981', '#6366f1']

export default function ConfidenceRating({ value = 0, onChange, readonly = false }) {
  const [hover, setHover] = useState(0)
  const active = hover || value

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            onClick={() => !readonly && onChange?.(i)}
            onMouseEnter={() => !readonly && setHover(i)}
            onMouseLeave={() => !readonly && setHover(0)}
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              border: 'none',
              cursor: readonly ? 'default' : 'pointer',
              background: i <= active ? COLORS[active] : 'rgba(255,255,255,0.1)',
              transition: 'all 0.15s ease',
              transform: !readonly && hover === i ? 'scale(1.25)' : 'scale(1)',
              padding: 0,
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      {active > 0 && (
        <span style={{ fontSize: '0.75rem', color: COLORS[active], fontWeight: 600 }}>
          {LABELS[active]}
        </span>
      )}
      {active === 0 && !readonly && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rate confidence</span>
      )}
    </div>
  )
}
