import { useState } from 'react'
import ExternalLink from '../components/ExternalLink.jsx'
import SearchBar from '../components/SearchBar.jsx'
import externalResources from '../data/externalResources.json'

export default function ResourcesPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = ['all', ...externalResources.map(c => c.category)]

  const filtered = externalResources
    .filter(cat => activeCategory === 'all' || cat.category === activeCategory)
    .map(cat => ({
      ...cat,
      resources: query
        ? cat.resources.filter(r =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.description.toLowerCase().includes(query.toLowerCase())
          )
        : cat.resources,
    }))
    .filter(cat => cat.resources.length > 0)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 4 }}>Resources</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Curated learning materials for your SDET interview prep
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 24 }}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search resources..."
          style={{ marginBottom: 12 }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? 'selected' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? 'All categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>No resources match your search.</p>
        </div>
      ) : (
        filtered.map(cat => (
          <section key={cat.category} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
              <h2 style={{ margin: 0, fontSize: '1.05rem' }}>{cat.category}</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({cat.resources.length})</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
              {cat.resources.map((resource, i) => (
                <ExternalLink key={i} {...resource} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
