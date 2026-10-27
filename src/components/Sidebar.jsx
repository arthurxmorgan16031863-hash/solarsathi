import {
  LayoutDashboard, Calculator, Lightbulb, BookOpen,
  MessageSquare, BarChart3, Users, Sun, Settings, LogOut
} from 'lucide-react'
import { useComplaints, SEED_OPEN } from '../utils/storage'

const NAV_ITEMS = [
  { id: 'overview',    label: 'Overview',             icon: LayoutDashboard },
  { id: 'calculator',  label: 'Solar Calculator',     icon: Calculator },
  { id: 'advisor',     label: 'Installation Advisor', icon: Lightbulb },
  { id: 'awareness',   label: 'Awareness Center',     icon: BookOpen },
  { id: 'complaints',  label: 'Complaints & Support', icon: MessageSquare },
  { id: 'surveys',     label: 'Community Surveys',    icon: Users },
  { id: 'admin',       label: 'Admin Analytics',      icon: BarChart3 },
]

export default function Sidebar({ activePage, setActivePage }) {
  const openCount = SEED_OPEN + useComplaints().filter(c => c.status === 'Open').length
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Sun size={20} color="white" />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">SolarSathi</span>
          <span className="sidebar-logo-tagline">Smart Energy Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Main</span>
        {NAV_ITEMS.slice(0, 4).map(item => (
          <NavItem key={item.id} item={item} active={activePage === item.id} onClick={() => setActivePage(item.id)} />
        ))}
        <span className="nav-section-label" style={{ marginTop: '8px' }}>Support & Community</span>
        {NAV_ITEMS.slice(4).map(item => (
          <NavItem key={item.id} item={item.id === 'complaints' ? { ...item, badge: openCount } : item} active={activePage === item.id} onClick={() => setActivePage(item.id)} />
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">AP</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Arjun Patel</span>
            <span className="sidebar-user-role">Demo User</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon className="nav-icon" size={17} />
      <span>{item.label}</span>
      {item.badge && <span className="nav-badge">{item.badge}</span>}
    </button>
  )
}
