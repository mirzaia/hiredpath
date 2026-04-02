import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, Activity, LayoutDashboard, HelpCircle, TrendingUp, BookOpen, Settings } from 'lucide-react'
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

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/questions', icon: HelpCircle, label: 'Tests' },
    { to: '/progress', icon: TrendingUp, label: 'Progress' },
    { to: '/resources', icon: BookOpen, label: 'Resources' },
  ]

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 text-white no-underline hover:text-white">
            <Activity className="w-6 h-6 text-orange-400" />
            <span className="font-bold text-lg tracking-tight">
              Hired<span className="text-orange-400">Path</span>
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-1 mx-8 text-white">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                  isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative w-full max-w-xs mx-4 text-slate-900 hidden sm:block">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search..."
              className="w-full text-sm bg-slate-800 text-slate-200 border-slate-700 focus:bg-slate-700"
            />
            {focused && results.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden text-slate-900">
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(r.url)}
                    className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-slate-50 ${i < results.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <span 
                      className="text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                      style={{ color: r.color, backgroundColor: `${r.color}15` }}
                    >
                      {r.type}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-slate-900 leading-tight">{r.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{r.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <input
              className="absolute inset-0 opacity-0 pointer-events-none"
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
            />
          </div>

          {/* Settings */}
          <button 
            onClick={() => { dispatch({ type: 'RESET_ONBOARDING' }); navigate('/'); }}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium transition-colors"
            title="Reset Stacks & Onboarding"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Breadcrumbs Top Bar */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="bg-slate-800 border-t border-slate-700 text-slate-300 px-4 sm:px-6 lg:px-8 py-2 text-xs font-medium flex gap-2">
          <div className="max-w-7xl mx-auto w-full flex gap-2 items-center">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex gap-2 items-center">
                {i > 0 && <span className="opacity-50">/</span>}
                <span className={i === breadcrumb.length - 1 ? 'text-white font-semibold' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
