import { useState, useMemo } from 'react'
import { Filter } from 'lucide-react'
import SearchBar from '../components/SearchBar.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import { useApp } from '../context/AppContext.jsx'
import modules from '../data/modules.json'

// Flatten all questions with module context
const ALL_QUESTIONS = modules.flatMap(mod =>
  mod.topics.flatMap(topic =>
    (topic.questions || []).map(q => ({
      ...q,
      moduleId: mod.id,
      moduleTitle: mod.title,
      moduleColor: mod.color,
      topicTitle: topic.title,
    }))
  )
)

export default function QuestionsPage() {
  const [query, setQuery] = useState('')
  const [activeModule, setActiveModule] = useState('all')
  const [showOnlyPending, setShowOnlyPending] = useState(false)
  const { state } = useApp()

  const filtered = useMemo(() => {
    return ALL_QUESTIONS.filter(q => {
      const matchesModule = activeModule === 'all' || q.moduleId === activeModule
      const matchesQuery = !query || q.question.toLowerCase().includes(query.toLowerCase())
      const matchesPending = !showOnlyPending || !state.completedQuestions.includes(q.id)
      return matchesModule && matchesQuery && matchesPending
    })
  }, [query, activeModule, showOnlyPending, state.completedQuestions])

  const completedCount = state.completedQuestions.length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 4 }}>Questions Bank</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          {completedCount} of {ALL_QUESTIONS.length} questions answered
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search questions..."
            style={{ flex: 1, minWidth: 200 }}
          />

          <button
            className={`btn btn-sm ${showOnlyPending ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowOnlyPending(s => !s)}
          >
            <Filter size={14} />
            {showOnlyPending ? 'Showing pending' : 'Show pending only'}
          </button>
        </div>

        {/* Module filter chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button
            className={`chip ${activeModule === 'all' ? 'selected' : ''}`}
            onClick={() => setActiveModule('all')}
          >
            All modules
          </button>
          {modules.map(mod => (
            <button
              key={mod.id}
              className={`chip ${activeModule === mod.id ? 'selected' : ''}`}
              onClick={() => setActiveModule(mod.id)}
              style={activeModule === mod.id ? { borderColor: mod.color, color: mod.color, background: `${mod.color}18` } : {}}
            >
              <span>{mod.icon}</span>
              {mod.title.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Showing {filtered.length} question{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Questions list */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🎉</div>
          <h3 style={{ marginBottom: 8 }}>
            {showOnlyPending ? 'All caught up!' : 'No questions found'}
          </h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {showOnlyPending
              ? "You've answered all questions in this filter. Try reviewing completed ones."
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <div>
          {filtered.map(q => (
            <QuestionCard key={q.id} question={q} showModule />
          ))}
        </div>
      )}
    </div>
  )
}
