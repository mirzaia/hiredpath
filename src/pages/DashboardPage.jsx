import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, HelpCircle, TrendingUp } from 'lucide-react'
import ProgressBar from '../components/ProgressBar.jsx'
import { useApp, useModuleProgress } from '../context/AppContext.jsx'
import modules from '../data/modules.json'

function ModuleCard({ mod, index }) {
  const { completed, total, pct } = useModuleProgress(mod.topics)
  const totalQuestions = mod.topics.reduce((acc, t) => acc + (t.questions?.length || 0), 0)
  const totalScenarios = mod.topics.reduce((acc, t) => acc + (t.scenarios?.length || 0), 0)

  return (
    <Link
      to={`/module/${mod.id}`}
      style={{ textDecoration: 'none' }}
      className={`glass-card interactive animate-slide-up stagger-${Math.min(index + 1, 5)}`}
    >
      <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: `${mod.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', flexShrink: 0,
            }}>
              {mod.icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.3 }}>{mod.title}</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{mod.subtitle}</p>
            </div>
          </div>
          <ProgressBar variant="circular" pct={pct} color={mod.color} size={56} strokeWidth={5} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <ProgressBar pct={pct} color={mod.color} label={`${completed} of ${total} topics done`} />
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <BookOpen size={13} />
            <span>{total} topics</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <HelpCircle size={13} />
            <span>{totalQuestions} questions</span>
          </div>
          <div style={{ marginLeft: 'auto', color: mod.color }}>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { state } = useApp()

  // Overall stats
  const allTopics = modules.flatMap(m => m.topics)
  const completedTopics = allTopics.filter(t => state.topicProgress[t.id]?.completed).length
  const totalTopics = allTopics.length
  const overallPct = Math.round((completedTopics / totalTopics) * 100)

  const allQuestions = allTopics.flatMap(t => t.questions || [])
  const completedQuestions = state.completedQuestions.length

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: 4, fontSize: '1.8rem' }}>Welcome back 👋</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          {completedTopics === 0
            ? "You haven't started yet. Pick a module below to begin."
            : `${completedTopics} of ${totalTopics} topics completed. Keep going!`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid-3 animate-slide-up" style={{ marginBottom: 32 }}>
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Overall Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ProgressBar variant="circular" pct={overallPct} color="var(--accent-primary)" size={64} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{completedTopics}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>of {totalTopics} topics</div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Questions Answered</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(34,211,238,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <HelpCircle size={28} color="var(--accent-secondary)" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{completedQuestions}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>of {allQuestions.length} total</div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Modules Active</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(16,185,129,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <TrendingUp size={28} color="var(--color-success)" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {modules.filter(m => m.topics.some(t => state.topicProgress[t.id]?.completed)).length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>of {modules.length} modules</div>
            </div>
          </div>
        </div>
      </div>

      {/* Module grid */}
      <h2 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Modules</h2>
      <div className="grid-auto">
        {modules.map((mod, i) => (
          <ModuleCard key={mod.id} mod={mod} index={i} />
        ))}
      </div>
    </div>
  )
}
