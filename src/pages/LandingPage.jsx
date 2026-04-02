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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden text-slate-900">
      {/* Background decorations */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'linear-gradient(theme(colors.slate.200) 1px, transparent 1px), linear-gradient(90deg, theme(colors.slate.200) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} 
      />
      
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="animate-fade-in text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 border border-orange-200 rounded-full mb-6 text-sm font-semibold text-orange-600 shadow-sm">
            <Sparkles size={14} className="text-orange-500" />
            Sr. SDET II Interview Preparation
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-slate-900">
            Crack Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Dream
            </span>{' '}
            Interview
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto">
            Your personalized knowledge hub. Master test strategy, microservices, automation, performance, and DevOps — one topic at a time.
          </p>
        </div>

        {/* Modules preview */}
        <div className="animate-slide-up stagger-1 flex gap-2 flex-wrap justify-center mb-10">
          {modules.map(mod => (
            <div key={mod.id} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-full text-xs font-semibold shadow-sm"
              style={{ borderColor: `${mod.color}30`, color: mod.color }}
            >
              <span>{mod.icon}</span>
              <span className="text-slate-600">{mod.title}</span>
            </div>
          ))}
        </div>

        {/* Stack selection */}
        <div className="glass-card animate-slide-up stagger-2 p-8 mb-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-1.5 mt-0">Choose your tech stacks</h3>
            <p className="text-sm text-slate-500 m-0">
              Select the languages and tools you'll be tested on. This personalizes your experience — you can change this anytime.
            </p>
          </div>

          <TechStackSelector selected={selected} onToggle={toggle} />
        </div>

        {/* CTA */}
        <div className="animate-slide-up stagger-3 flex justify-center">
          <button
            className="btn btn-primary btn-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto min-w-[240px]"
            onClick={handleStart}
          >
            {selected.length > 0 ? `Start Prep with ${selected.join(', ')}` : 'Start Prep'}
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="animate-fade-in stagger-4 text-center mt-6 text-xs font-medium text-slate-400">
          Your progress is saved locally in your browser.
        </p>
      </div>
    </div>
  )
}
