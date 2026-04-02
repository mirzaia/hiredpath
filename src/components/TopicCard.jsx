import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import ConfidenceRating from './ConfidenceRating.jsx'
import { useTopicState } from '../context/AppContext.jsx'

export default function TopicCard({ topic, moduleId, moduleColor, index, isLast }) {
  const { completed, confidence, toggle, setConfidence } = useTopicState(topic.id)

  return (
    <div
      className={`p-5 transition-colors duration-200 hover:bg-slate-50 animate-slide-up ${
        !isLast ? 'border-b border-slate-100' : ''
      }`}
      style={{
        backgroundColor: completed ? 'rgba(16,185,129,0.02)' : undefined,
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
      }}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={e => { e.preventDefault(); toggle() }}
          className="bg-transparent border-none p-0 cursor-pointer flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
        >
          {completed
            ? <CheckCircle2 size={24} className="text-emerald-500" />
            : <Circle size={24} className="text-slate-300 hover:text-slate-400" />
          }
        </button>

        <div className="flex-1 min-w-0">
          <Link
            to={`/module/${moduleId}/topic/${topic.id}`}
            className="flex items-center gap-2 mb-1.5 no-underline group"
          >
            <h4 className={`m-0 text-base font-bold leading-tight transition-colors group-hover:text-orange-500
              ${completed ? 'text-slate-500 line-through opacity-80' : 'text-slate-900'}
            `}>
              {topic.title}
            </h4>
            <ChevronRight size={16} className="text-slate-400 flex-shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="m-0 mb-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            {topic.summary}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span style={{ color: moduleColor }}>
                {topic.scenarios?.length || 0} scenarios
              </span>
              <span className="opacity-50">·</span>
              <span>{topic.questions?.length || 0} questions</span>
            </div>
            <ConfidenceRating value={confidence} onChange={setConfidence} />
          </div>
        </div>
      </div>
    </div>
  )
}
