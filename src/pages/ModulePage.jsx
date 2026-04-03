import { useParams, Navigate } from 'react-router-dom'
import { BookOpen, HelpCircle, Target } from 'lucide-react'
import TopicCard from '../components/TopicCard.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { useApp, useModuleProgress } from '../context/AppContext.jsx'
import modulesData from '../data/modules.json'

export default function ModulePage() {
  const { moduleId } = useParams()
  const { state } = useApp()
  const activePlan = state.savedPlans?.find(p => p.id === state.activePlanId)
  const activeModules = activePlan ? activePlan.modules : (state.customPlan || modulesData)
  const mod = activeModules.find(m => m.id === moduleId)

  if (!mod) return <Navigate to="/dashboard" replace />

  const { completed, total, pct } = useModuleProgress(mod.topics)
  const totalQuestions = mod.topics.reduce((acc, t) => acc + (t.questions?.length || 0), 0)
  const totalScenarios = mod.topics.reduce((acc, t) => acc + (t.scenarios?.length || 0), 0)

  return (
    <div>
      {/* Module header */}
      <div className="glass-card animate-fade-in p-7 mb-8 text-slate-900">
        <div className="flex flex-wrap items-start gap-5">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: `${mod.color}15` }}
          >
            {mod.icon}
          </div>

          <div className="flex-1 min-w-[200px]">
            <div 
              className="text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: mod.color }}
            >
              Module
            </div>
            <h1 className="text-2xl font-bold mb-1 leading-tight">{mod.title}</h1>
            <p className="m-0 text-slate-500 text-sm leading-relaxed">{mod.subtitle}</p>
          </div>

          <ProgressBar variant="circular" pct={pct} color={mod.color} size={80} strokeWidth={7} />
        </div>

        <div className="mt-6">
          <ProgressBar pct={pct} color={mod.color} label={`${completed} of ${total} topics completed`} />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mt-5">
          {[
            { icon: BookOpen, label: 'Topics', value: total },
            { icon: Target, label: 'Scenarios', value: totalScenarios },
            { icon: HelpCircle, label: 'Questions', value: totalQuestions },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={16} style={{ color: mod.color }} />
              <span className="font-semibold text-slate-900">{value}</span>
              <span className="text-slate-500 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topics list */}
      <h2 className="mb-4 text-lg font-bold text-slate-900">Topics</h2>
      <div className="flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {mod.topics.map((topic, i) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            moduleId={mod.id}
            moduleColor={mod.color}
            index={i}
            isLast={i === mod.topics.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
