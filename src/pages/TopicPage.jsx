import { useParams, Navigate, Link } from 'react-router-dom'
import { CheckCircle2, Circle, ArrowLeft, ArrowRight } from 'lucide-react'
import ScenarioCard from '../components/ScenarioCard.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import ExternalLink from '../components/ExternalLink.jsx'
import ConfidenceRating from '../components/ConfidenceRating.jsx'
import { useTopicState } from '../context/AppContext.jsx'
import modules from '../data/modules.json'

function TheoryBlock({ text }) {
  // Very lightweight markdown rendering (bold, inline code, code blocks)
  const renderLine = (line, i) => {
    if (line.startsWith('**') || line.includes('**')) {
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      return (
        <span key={i}>
          {parts.map((p, j) =>
            p.startsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p
          )}
        </span>
      )
    }
    if (line.startsWith('```')) return null
    return <span key={i}>{line}</span>
  }

  const lines = text.split('\n')
  const blocks = []
  let codeBuffer = []
  let inCode = false

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCode) {
        blocks.push({ type: 'code', content: codeBuffer.join('\n'), key: i })
        codeBuffer = []
        inCode = false
      } else {
        inCode = true
      }
      return
    }
    if (inCode) { codeBuffer.push(line); return }

    if (line.trim() === '') {
      blocks.push({ type: 'spacer', key: i })
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({ type: 'bullet', content: line.slice(2), key: i })
    } else if (/^\d+\./.test(line)) {
      blocks.push({ type: 'ordered', content: line.replace(/^\d+\.\s*/, ''), key: i })
    } else {
      blocks.push({ type: 'para', content: line, key: i })
    }
  })

  return (
    <div className="theory-content" style={{ lineHeight: 1.8 }}>
      {blocks.map(block => {
        if (block.type === 'spacer') return <div key={block.key} style={{ height: 8 }} />
        if (block.type === 'code') return (
          <pre key={block.key}><code>{block.content}</code></pre>
        )
        if (block.type === 'bullet') return (
          <div key={block.key} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <span style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: 2 }}>▸</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {renderLine(block.content, block.key)}
            </span>
          </div>
        )
        if (block.type === 'ordered') return (
          <div key={block.key} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <span style={{ color: 'var(--accent-secondary)', flexShrink: 0 }}>→</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {renderLine(block.content, block.key)}
            </span>
          </div>
        )
        return (
          <p key={block.key} style={{ fontSize: '0.9rem', margin: '4px 0' }}>
            {renderLine(block.content, block.key)}
          </p>
        )
      })}
    </div>
  )
}

export default function TopicPage() {
  const { moduleId, topicId } = useParams()
  const mod = modules.find(m => m.id === moduleId)
  const topic = mod?.topics.find(t => t.id === topicId)

  if (!mod || !topic) return <Navigate to="/dashboard" replace />

  const { completed, confidence, toggle, setConfidence } = useTopicState(topicId)

  // Prev / Next topic navigation
  const topicIndex = mod.topics.findIndex(t => t.id === topicId)
  const prevTopic = mod.topics[topicIndex - 1]
  const nextTopic = mod.topics[topicIndex + 1]

  return (
    <div>
      {/* Back link */}
      <Link
        to={`/module/${moduleId}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20, textDecoration: 'none' }}
      >
        <ArrowLeft size={14} />
        Back to {mod.title}
      </Link>

      {/* Topic header */}
      <div className="glass-card animate-fade-in" style={{ padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: '0.72rem', fontWeight: 600, color: mod.color,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              padding: '3px 10px', background: `${mod.color}18`,
              borderRadius: 'var(--radius-full)', marginBottom: 10,
            }}>
              {mod.icon} {mod.title}
            </div>
            <h1 style={{ marginBottom: 8, fontSize: '1.5rem' }}>{topic.title}</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{topic.summary}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
            <button
              onClick={toggle}
              className="btn btn-secondary btn-sm"
              style={completed ? { borderColor: 'rgba(16,185,129,0.4)', color: 'var(--color-success)', background: 'rgba(16,185,129,0.08)' } : {}}
            >
              {completed ? <CheckCircle2 size={15} /> : <Circle size={15} />}
              {completed ? 'Completed' : 'Mark complete'}
            </button>
            <ConfidenceRating value={confidence} onChange={setConfidence} />
          </div>
        </div>
      </div>

      {/* Theory */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16, fontSize: '1.05rem' }}>📖 Theory</h2>
        <div className="glass-card" style={{ padding: '24px' }}>
          <TheoryBlock text={topic.theory} />
        </div>
      </section>

      {/* Scenarios */}
      {topic.scenarios?.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ marginBottom: 16, fontSize: '1.05rem' }}>
            🎯 Scenario Challenges
            <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
              ({topic.scenarios.length})
            </span>
          </h2>
          {topic.scenarios.map(s => (
            <ScenarioCard key={s.id} scenario={s} />
          ))}
        </section>
      )}

      {/* Questions */}
      {topic.questions?.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ marginBottom: 16, fontSize: '1.05rem' }}>
            ❓ Interview Questions
            <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
              ({topic.questions.length})
            </span>
          </h2>
          {topic.questions.map(q => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </section>
      )}

      {/* External links */}
      {topic.links?.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ marginBottom: 16, fontSize: '1.05rem' }}>🔗 Resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topic.links.map((link, i) => (
              <ExternalLink key={i} {...link} />
            ))}
          </div>
        </section>
      )}

      {/* Prev / Next navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 16 }}>
        {prevTopic ? (
          <Link
            to={`/module/${moduleId}/topic/${prevTopic.id}`}
            className="glass-card interactive"
            style={{ padding: '14px 18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}
          >
            <ArrowLeft size={16} color="var(--text-muted)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>Previous</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{prevTopic.title}</div>
            </div>
          </Link>
        ) : <div style={{ flex: 1 }} />}

        {nextTopic ? (
          <Link
            to={`/module/${moduleId}/topic/${nextTopic.id}`}
            className="glass-card interactive"
            style={{ padding: '14px 18px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, flex: 1 }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>Next</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{nextTopic.title}</div>
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </Link>
        ) : <div style={{ flex: 1 }} />}
      </div>
    </div>
  )
}
