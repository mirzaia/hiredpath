import { Link } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import ProgressBar from '../components/ProgressBar.jsx'
import { useApp, useModuleProgress } from '../context/AppContext.jsx'
import modules from '../data/modules.json'

const CONFIDENCE_COLORS = ['', '#ef4444', '#f59e0b', '#eab308', '#10b981', '#6366f1']
const CONFIDENCE_LABELS = ['', 'Beginner', 'Basic', 'Comfortable', 'Confident', 'Expert']

function ModuleProgressRow({ mod }) {
  const { completed, total, pct } = useModuleProgress(mod.topics)
  const { state } = useApp()

  // Confidence breakdown for this module
  const confidenceDist = [0, 0, 0, 0, 0] // index 0 = level 1, etc.
  mod.topics.forEach(t => {
    const conf = state.topicProgress[t.id]?.confidence || 0
    if (conf >= 1 && conf <= 5) confidenceDist[conf - 1]++
  })

  const avgConfidence = (() => {
    const rated = mod.topics.filter(t => (state.topicProgress[t.id]?.confidence || 0) > 0)
    if (rated.length === 0) return 0
    const sum = rated.reduce((acc, t) => acc + (state.topicProgress[t.id]?.confidence || 0), 0)
    return (sum / rated.length).toFixed(1)
  })()

  return (
    <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.3rem' }}>{mod.icon}</span>
        <div style={{ flex: 1, minWidth: 160 }}>
          <Link to={`/module/${mod.id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>
            {mod.title}
          </Link>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {completed}/{total} topics · Avg confidence: {avgConfidence > 0 ? avgConfidence : '—'}
          </div>
        </div>
        <ProgressBar variant="circular" pct={pct} color={mod.color} size={52} strokeWidth={5} />
      </div>

      <ProgressBar pct={pct} color={mod.color} label={`${pct}% complete`} />

      {/* Confidence bar distribution */}
      {confidenceDist.some(n => n > 0) && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Confidence distribution
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 32 }}>
            {confidenceDist.map((count, i) => {
              const level = i + 1
              const maxCount = Math.max(...confidenceDist, 1)
              const height = count > 0 ? Math.max(4, (count / maxCount) * 28) : 4
              return (
                <div key={level} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{
                    width: 24, height,
                    background: count > 0 ? CONFIDENCE_COLORS[level] : 'rgba(255,255,255,0.07)',
                    borderRadius: 3,
                    transition: 'height 0.5s ease',
                  }} />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{CONFIDENCE_LABELS[level].slice(0, 4)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProgressPage() {
  const { state, dispatch } = useApp()

  const allTopics = modules.flatMap(m => m.topics)
  const completedTopics = allTopics.filter(t => state.topicProgress[t.id]?.completed).length
  const totalTopics = allTopics.length
  const overallPct = Math.round((completedTopics / totalTopics) * 100)

  const allQuestions = allTopics.flatMap(t => t.questions || [])
  const completedQuestions = state.completedQuestions.length
  const questionsPct = Math.round((completedQuestions / allQuestions.length) * 100)

  const ratedTopics = allTopics.filter(t => (state.topicProgress[t.id]?.confidence || 0) > 0)
  const avgConfidence = ratedTopics.length > 0
    ? (ratedTopics.reduce((acc, t) => acc + (state.topicProgress[t.id]?.confidence || 0), 0) / ratedTopics.length).toFixed(1)
    : null

  const handleReset = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      dispatch({ type: 'RESET' })
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>My Progress</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Track your interview readiness</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleReset} style={{ color: 'var(--color-error)' }}>
          <RotateCcw size={14} />
          Reset progress
        </button>
      </div>

      {/* Overall stats */}
      <div className="grid-3 animate-slide-up" style={{ marginBottom: 32 }}>
        <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <ProgressBar variant="circular" pct={overallPct} color="var(--accent-primary)" size={80} strokeWidth={7} style={{ margin: '0 auto 12px' }} />
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{completedTopics} / {totalTopics}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Topics Completed</div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <ProgressBar variant="circular" pct={questionsPct} color="var(--accent-secondary)" size={80} strokeWidth={7} style={{ margin: '0 auto 12px' }} />
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{completedQuestions} / {allQuestions.length}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Questions Answered</div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(16,185,129,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12, fontSize: '2rem',
          }}>
            {avgConfidence ? '⭐' : '—'}
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{avgConfidence || '—'} / 5</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Avg Confidence</div>
        </div>
      </div>

      {/* Per-module breakdown */}
      <h2 style={{ marginBottom: 16, fontSize: '1.05rem' }}>Module Breakdown</h2>
      {modules.map(mod => (
        <ModuleProgressRow key={mod.id} mod={mod} />
      ))}
    </div>
  )
}
