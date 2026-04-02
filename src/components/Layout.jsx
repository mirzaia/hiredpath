import { Outlet, useLocation, useParams } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'
import modules from '../data/modules.json'

function useBreadcrumb() {
  const location = useLocation()
  const { moduleId, topicId } = useParams()
  const crumbs = []

  const path = location.pathname

  if (path.startsWith('/dashboard')) {
    crumbs.push('Dashboard')
  } else if (path.startsWith('/questions')) {
    crumbs.push('Questions Bank')
  } else if (path.startsWith('/progress')) {
    crumbs.push('My Progress')
  } else if (path.startsWith('/resources')) {
    crumbs.push('Resources')
  } else if (moduleId) {
    const mod = modules.find(m => m.id === moduleId)
    if (mod) {
      crumbs.push(mod.title)
      if (topicId) {
        const topic = mod.topics.find(t => t.id === topicId)
        if (topic) crumbs.push(topic.title)
      }
    }
  }

  return crumbs
}

function LayoutContent() {
  const breadcrumb = useBreadcrumb()
  return (
    <div className="app-shell bg-grid">
      <Sidebar />
      <div className="main-content">
        <Header breadcrumb={breadcrumb} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function Layout() {
  return <LayoutContent />
}
