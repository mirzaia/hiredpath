import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext.jsx'
import Layout from './components/Layout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ModulePage from './pages/ModulePage.jsx'
import TopicPage from './pages/TopicPage.jsx'
import QuestionsPage from './pages/QuestionsPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'
import ResourcesPage from './pages/ResourcesPage.jsx'

function AppRoutes() {
  const { state } = useApp()

  return (
    <Routes>
      <Route
        path="/"
        element={
          state.onboardingDone
            ? <Navigate to="/dashboard" replace />
            : <LandingPage />
        }
      />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        <Route path="/module/:moduleId/topic/:topicId" element={<TopicPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}
