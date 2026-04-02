import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import SearchBar from './SearchBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import modules from '../data/modules.json'

function buildSearchIndex() {
  const results = []
  modules.forEach(mod => {
    mod.topics.forEach(topic => {
      results.push({ type: 'topic', title: topic.title, subtitle: mod.title, url: `/module/${mod.id}/topic/${topic.id}`, color: mod.color })
      topic.questions?.forEach(q => {
        results.push({ type: 'question', title: q.question, subtitle: topic.title, url: `/module/${mod.id}/topic/${topic.id}`, color: mod.color })
      })
    })
  })
  return results
}

const SEARCH_INDEX = buildSearchIndex()

export default function Header({ breadcrumb }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()
  const { dispatch } = useApp()

  const results = query.trim().length > 1
    ? SEARCH_INDEX.filter(item => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : []

  const handleSelect = (url) => {
    setQuery('')
    setFocused(false)
    navigate(url)
  }

  return (
    <header className="page-header">
      <button
        className="btn btn-ghost"
        style={{ padding: 8, flexShrink: 0 }}
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      {breadcrumb && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)', flexShrink: 0 }}>
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ color: 'var(--text-muted)', opacity: 0.4 }}>/</span>}
              <span style={{ color: i === breadcrumb.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {crumb}
              </span>
            </span>
          ))}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search topics, questions..."
          style={{ width: '100%' }}
        />
        {focused && results.length > 0 && (
          <div style={{
            position: 'absolute', top: '110%', left: 0, right: 0,
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 10, zIndex: 200,
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}>
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSelect(r.url)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'flex-start',
                  gap: 10, padding: '10px 14px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left', borderBottom: i < results.length - 1 ? '1px solid var(--glass-border)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span style={{
                  fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase',
                  color: r.color, padding: '2px 6px', background: `${r.color}18`,
                  borderRadius: 4, flexShrink: 0, marginTop: 2
                }}>
                  {r.type}
                </span>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{r.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        <input
          style={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none' }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
        {/* invisible focus tracker */}
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
          onFocus={() => setFocused(true)}
        />
      </div>

      <div
        style={{ position: 'absolute', inset: 0, zIndex: -1 }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
      />
    </header>
  )
}
