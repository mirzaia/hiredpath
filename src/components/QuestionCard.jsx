import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react'
import { useQuestionState } from '../context/AppContext.jsx'

export default function QuestionCard({ question, showModule }) {
  const [revealed, setRevealed] = useState(false)
  const { isCompleted, toggle } = useQuestionState(question.id)

  return (
    <div
      className="glass-card"
      style={{
        padding: '18px 20px',
        marginBottom: 10,
        borderColor: isCompleted ? 'rgba(16,185,129,0.25)' : undefined,
        background: isCompleted ? 'rgba(16,185,129,0.04)' : undefined,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <button
          onClick={toggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 2 }}
          title={isCompleted ? 'Mark as not done' : 'Mark as done'}
        >
          {isCompleted
            ? <CheckCircle2 size={20} color="var(--color-success)" />
            : <Circle size={20} color="var(--text-muted)" />
          }
        </button>

        <div style={{ flex: 1 }}>
          {showModule && question.moduleTitle && (
            <span style={{
              display: 'inline-block',
              fontSize: '0.7rem', fontWeight: 600, color: question.moduleColor,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              marginBottom: 6, background: `${question.moduleColor}18`,
              padding: '2px 8px', borderRadius: 4
            }}>
              {question.moduleTitle}
            </span>
          )}
          <p style={{
            margin: 0, fontSize: '0.9rem', fontWeight: 500,
            color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
            lineHeight: 1.5,
            textDecoration: isCompleted ? 'line-through' : 'none',
            opacity: isCompleted ? 0.7 : 1,
          }}>
            {question.question}
          </p>
        </div>

        <button
          onClick={() => setRevealed(r => !r)}
          className="btn-ghost"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, flexShrink: 0, color: 'var(--text-muted)',
            display: 'flex',
          }}
          title={revealed ? 'Hide answer' : 'Show answer'}
        >
          {revealed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {revealed && (
        <div style={{
          marginTop: 12,
          marginLeft: 32,
          padding: '12px 16px',
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 8,
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          animation: 'slideUp 0.2s ease forwards',
        }}>
          {question.answer}
        </div>
      )}
    </div>
  )
}
