import { useState } from 'react'
import { ChevronDown, ChevronUp, Lightbulb, CheckCircle2 } from 'lucide-react'

export default function ScenarioCard({ scenario }) {
  const [expanded, setExpanded] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const difficultyClass = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  }[scenario.difficulty] || 'badge-primary'

  return (
    <div className="glass-card" style={{ padding: '20px', marginBottom: 12 }}>
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(99,102,241,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '1.1rem' }}>🎯</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{scenario.title}</h4>
            <span className={`badge ${difficultyClass}`}>{scenario.difficulty}</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {scenario.description}
          </p>
        </div>
        <div style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--glass-border)' }}>
          {scenario.hints && (
            <div style={{ marginBottom: 16 }}>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginBottom: showHints ? 10 : 0 }}
                onClick={() => setShowHints(s => !s)}
              >
                <Lightbulb size={14} />
                {showHints ? 'Hide hints' : 'Show hints'}
              </button>
              {showHints && (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {scenario.hints.map((hint, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--color-warning)', flexShrink: 0 }}>💡</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowAnswer(s => !s)}
          >
            <CheckCircle2 size={14} />
            {showAnswer ? 'Hide answer' : 'Reveal answer'}
          </button>

          {showAnswer && (
            <div style={{
              marginTop: 12,
              padding: '14px 16px',
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 10,
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}>
              {scenario.answer}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
