import { useState, useEffect, lazy, Suspense } from 'react'
import { readJSON, writeJSON } from './utils/storage'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
const Overview = lazy(() => import('./pages/Overview'))
const SolarCalculator = lazy(() => import('./pages/SolarCalculator'))
const InstallationAdvisor = lazy(() => import('./pages/InstallationAdvisor'))
const AwarenessCenter = lazy(() => import('./pages/AwarenessCenter'))
const ComplaintsSupport = lazy(() => import('./pages/ComplaintsSupport'))
const CommunitySurveys = lazy(() => import('./pages/CommunitySurveys'))
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'))

const PAGE_TITLES = {
  overview: 'Dashboard Overview',
  calculator: 'Solar Calculator',
  advisor: 'Installation Advisor',
  awareness: 'Awareness Center',
  complaints: 'Complaints & Support',
  surveys: 'Community Surveys',
  admin: 'Admin Analytics',
}

export default function App() {
  const [activePage, setActivePage] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const goTo = id => { setActivePage(id); setMenuOpen(false) }
  const [theme, setTheme] = useState(() => (readJSON('ss_theme', 'light') === 'dark' ? 'dark' : 'light'))

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const toggleTheme = () => setTheme(t => {
    const next = t === 'dark' ? 'light' : 'dark'
    writeJSON('ss_theme', next)
    return next
  })

  const renderPage = () => {
    switch (activePage) {
      case 'overview':    return <Overview setActivePage={setActivePage} />
      case 'calculator':  return <SolarCalculator />
      case 'advisor':     return <InstallationAdvisor />
      case 'awareness':   return <AwarenessCenter />
      case 'complaints':  return <ComplaintsSupport />
      case 'surveys':     return <CommunitySurveys />
      case 'admin':       return <AdminAnalytics />
      default:            return <Overview setActivePage={setActivePage} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={goTo} open={menuOpen} />
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}
      <div className="main-area">
        <TopBar title={PAGE_TITLES[activePage]} theme={theme} toggleTheme={toggleTheme} onMenu={() => setMenuOpen(o => !o)} />
        <div className="page-content fade-in" key={activePage}>
          <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>{renderPage()}</Suspense>
        </div>
      </div>
    </div>
  )
}
