import { Bell, Search, Moon, Sun, ChevronDown } from 'lucide-react'

export default function TopBar({ title, theme, toggleTheme }) {
  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>

      <div className="topbar-search">
        <Search size={15} color="#9ca3af" />
        <input type="text" placeholder="Search anything..." />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="icon-btn" title="Notifications">
          <Bell size={17} />
          <span className="notif-dot" />
        </button>
        <div className="topbar-profile">
          <div className="profile-avatar">AP</div>
          <span className="profile-name">Arjun Patel</span>
          <ChevronDown size={14} color="#9ca3af" />
        </div>
      </div>
    </header>
  )
}
