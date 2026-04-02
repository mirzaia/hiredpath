import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import TechStackSelector from '../components/TechStackSelector.jsx'
import { useApp } from '../context/AppContext.jsx'
import modules from '../data/modules.json'

export default function LandingPage() {
  const [selected, setSelected] = useState([])
  const { dispatch } = useApp()
  const navigate = useNavigate()

  const toggle = (id) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )

  const handleStart = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING', stacks: selected })
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(79,70,229,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50vh',
        background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(79,70,229,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 680 }}>
        {/* Header */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 24,
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)',
          }}>
            <Sparkles size={14} />
            Sr. SDET II Interview Preparation
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: 16, lineHeight: 1.15 }}>
            Crack Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Dream
            </span>{' '}
            Interview
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
            Your personalized knowledge hub. Master test strategy, microservices, automation, performance, and DevOps — one topic at a time.
          </p>
        </div>

        {/* Modules preview */}
        <div className="animate-slide-up stagger-1" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
          {modules.map(mod => (
            <div key={mod.id} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: `${mod.color}12`,
              border: `1px solid ${mod.color}30`,
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem', color: mod.color, fontWeight: 500,
            }}>
              <span>{mod.icon}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{mod.title}</span>
            </div>
          ))}
        </div>

        {/* Stack selection */}
        <div
          className="glass-card animate-slide-up stagger-2"
          style={{ padding: 28, marginBottom: 20 }}
        >
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 6 }}>Choose your tech stacks</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              Select the languages and tools you'll be tested on. This personalizes your experience — you can change this anytime.
            </p>
          </div>

          <TechStackSelector selected={selected} onToggle={toggle} />
        </div>

        {/* CTA */}
        <div className="animate-slide-up stagger-3" style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleStart}
            style={{ minWidth: 200 }}
          >
            {selected.length > 0 ? `Start Prep with ${selected.join(', ')}` : 'Start Prep'}
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="animate-fade-in stagger-4" style={{ textAlign: 'center', marginTop: 16, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Your progress is saved locally in your browser.
        </p>
      </div>
    </div>
  )
}
