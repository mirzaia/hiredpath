import { useParams, Navigate } from 'react-router-dom'
import { BookOpen, HelpCircle, Target } from 'lucide-react'
import TopicCard from '../components/TopicCard.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { useModuleProgress } from '../context/AppContext.jsx'
import modules from '../data/modules.json'

export default function ModulePage() {
  const { moduleId } = useParams()
  const mod = modules.find(m => m.id === moduleId)

  if (!mod) return <Navigate to="/dashboard" replace />

  const { completed, total, pct } = useModuleProgress(mod.topics)
  const totalQuestions = mod.topics.reduce((acc, t) => acc + (t.questions?.length || 0), 0)
  const totalScenarios = mod.topics.reduce((acc, t) => acc + (t.scenarios?.length || 0), 0)

  return (
    <div>
      {/* Module header */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: `${mod.color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', flexShrink: 0,
          }}>
            {mod.icon}
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{
              fontSize: '0.72rem', fontWeight: 600, color: mod.color,
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6
            }}>
              Module
            </div>
            <h1 style={{ marginBottom: 4, fontSize: '1.5rem' }}>{mod.title}</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{mod.subtitle}</p>
          </div>

          <ProgressBar variant="circular" pct={pct} color={mod.color} size={80} strokeWidth={7} />
        </div>

        <div style={{ marginTop: 20 }}>
          <ProgressBar pct={pct} color={mod.color} label={`${completed} of ${total} topics completed`} />
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { icon: BookOpen, label: 'Topics', value: total },
            { icon: Target, label: 'Scenarios', value: totalScenarios },
            { icon: HelpCircle, label: 'Questions', value: totalQuestions },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={15} color={mod.color} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topics list */}
      <h2 style={{ marginBottom: 16, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>Topics</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {mod.topics.map((topic, i) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            moduleId={mod.id}
            moduleColor={mod.color}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
