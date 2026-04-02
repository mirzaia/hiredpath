import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'
import ConfidenceRating from './ConfidenceRating.jsx'
import { useTopicState } from '../context/AppContext.jsx'

export default function TopicCard({ topic, moduleId, moduleColor, index }) {
  const { completed, confidence, toggle, setConfidence } = useTopicState(topic.id)

  return (
    <div
      className="glass-card animate-slide-up"
      style={{
        padding: '20px',
        borderColor: completed ? 'rgba(16,185,129,0.25)' : undefined,
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button
          onClick={e => { e.preventDefault(); toggle() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 2 }}
        >
          {completed
            ? <CheckCircle2 size={22} color="var(--color-success)" />
            : <Circle size={22} color="var(--text-muted)" />
          }
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Link
            to={`/module/${moduleId}/topic/${topic.id}`}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}
          >
            <h4 style={{
              margin: 0, fontSize: '0.95rem',
              color: completed ? 'var(--text-secondary)' : 'var(--text-primary)',
              textDecoration: completed ? 'line-through' : 'none',
              opacity: completed ? 0.8 : 1,
            }}>
              {topic.title}
            </h4>
            <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          </Link>
          <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {topic.summary}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: moduleColor }}>
                {topic.scenarios?.length || 0} scenarios
              </span>
              <span>·</span>
              <span>{topic.questions?.length || 0} questions</span>
            </div>
            <ConfidenceRating value={confidence} onChange={setConfidence} />
          </div>
        </div>
      </div>
    </div>
  )
}
