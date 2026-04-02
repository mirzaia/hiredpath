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
      className={`glass-card interactive animate-slide-up stagger-${Math.min(index + 1, 5)} flex flex-col p-6 no-underline text-slate-900 group`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${mod.color}15` }}
          >
            {mod.icon}
          </div>
          <div>
            <h3 className="m-0 text-base font-bold leading-tight text-slate-900">{mod.title}</h3>
            <p className="m-0 text-xs text-slate-500 mt-1">{mod.subtitle}</p>
          </div>
        </div>
        <ProgressBar variant="circular" pct={pct} color={mod.color} size={56} strokeWidth={5} />
      </div>

      <div className="mb-6">
        <ProgressBar pct={pct} color={mod.color} label={`${completed} of ${total} topics done`} />
      </div>

      <div className="flex gap-4 mt-auto">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{total} topics</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{totalQuestions} questions</span>
        </div>
        <div className="ml-auto transition-transform group-hover:translate-x-1" style={{ color: mod.color }}>
          <ArrowRight className="w-4 h-4" />
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back 👋</h1>
        <p className="text-slate-600 m-0">
          {completedTopics === 0
            ? "You haven't started yet. Pick a module below to begin."
            : `${completedTopics} of ${totalTopics} topics completed. Keep going!`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up mb-8">
        <div className="glass-card p-5">
          <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Overall Progress</div>
          <div className="flex items-center gap-4">
            <ProgressBar variant="circular" pct={overallPct} color="#f97316" size={64} />
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-none mb-1">{completedTopics}</div>
              <div className="text-sm font-medium text-slate-500">of {totalTopics} topics</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Questions Answered</div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-7 h-7 text-cyan-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-none mb-1">{completedQuestions}</div>
              <div className="text-sm font-medium text-slate-500">of {allQuestions.length} total</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Modules Active</div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-none mb-1">
                {modules.filter(m => m.topics.some(t => state.topicProgress[t.id]?.completed)).length}
              </div>
              <div className="text-sm font-medium text-slate-500">of {modules.length} modules</div>
            </div>
          </div>
        </div>
      </div>

      {/* Module grid */}
      <h2 className="text-xl font-bold text-slate-900 mb-4">Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, i) => (
          <ModuleCard key={mod.id} mod={mod} index={i} />
        ))}
      </div>
    </div>
  )
}
