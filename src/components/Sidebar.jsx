import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'
import { useApp, useModuleProgress } from '../context/AppContext.jsx'
import modules from '../data/modules.json'

function ModuleNavItem({ mod }) {
  const { completed, total, pct } = useModuleProgress(mod.topics)
  return (
    <NavLink
      to={`/module/${mod.id}`}
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      style={({ isActive }) => isActive ? { borderColor: `${mod.color}40`, color: mod.color, background: `${mod.color}12` } : {}}
    >
      <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{mod.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {mod.title}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: 4 }}>
            {completed}/{total}
          </span>
        </div>
        <ProgressBar pct={pct} color={mod.color} />
      </div>
    </NavLink>
  )
}

const NAV_ITEMS = [
  { to: '/dashboard', emoji: '📊', label: 'Dashboard' },
  { to: '/questions', emoji: '❓', label: 'Questions Bank' },
  { to: '/progress', emoji: '📈', label: 'My Progress' },
  { to: '/resources', emoji: '🔗', label: 'Resources' },
]

export default function Sidebar() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()

  const handleChangeStacks = () => {
    dispatch({ type: 'RESET_ONBOARDING' })
    navigate('/')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--glass-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
            }}>
              🎯
            </div>
            <div>
              <div style={{
                fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2,
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                HiredPath
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SDET Interview Prep</div>
            </div>
          </div>
        </div>
      </Link>

      {/* Selected stacks */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Your Stacks
          </div>
          <button
            onClick={handleChangeStacks}
            title="Change tech stacks"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 2,
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
              borderRadius: 4, transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Settings size={12} />
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {state.selectedStacks.length > 0
            ? state.selectedStacks.map(id => (
                <span key={id} className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{id}</span>
              ))
            : <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>None selected</span>
          }
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 12px 0' }}>
        {/* Main nav */}
        {NAV_ITEMS.map(({ to, emoji, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ marginBottom: 2 }}
          >
            <span style={{ fontSize: '1rem' }}>{emoji}</span>
            {label}
          </NavLink>
        ))}

        {/* Modules */}
        <div style={{ marginTop: 16, marginBottom: 6 }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px 8px' }}>
            Modules
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {modules.map(mod => (
              <ModuleNavItem key={mod.id} mod={mod} />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          HiredPath — SDET Interview Prep
        </div>
      </div>
    </aside>
  )
}
