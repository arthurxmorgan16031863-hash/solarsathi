import { Bell, Search, Moon, Sun, ChevronDown } from 'lucide-react'

import { useProfileName, initials } from '../utils/storage'

export default function TopBar({ title, theme, toggleTheme }) {
  const [profileName, editName] = useProfileName()
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
        <div className="topbar-profile" onClick={editName} role="button" title="Click to set your name" style={{ cursor: 'pointer' }}>
          <div className="profile-avatar">{profileName ? initials(profileName) : '?'}</div>
          <span className="profile-name">{profileName || 'Add your name'}</span>
          <ChevronDown size={14} color="#9ca3af" />
        </div>
      </div>
    </header>
  )
}
