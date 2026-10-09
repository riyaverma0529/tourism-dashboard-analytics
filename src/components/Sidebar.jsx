const NAV = [
  { section: 'Overview' },
  { icon: '📊', label: 'Dashboard',    id: 'dashboard' },
  { icon: '🗺️', label: 'Destinations', id: 'destinations' },
  { icon: '👥', label: 'Visitors',     id: 'visitors' },
  { section: 'Analytics' },
  { icon: '📈', label: 'Trends',       id: 'trends' },
  { icon: '💰', label: 'Revenue',      id: 'revenue' },
  { icon: '⭐', label: 'Satisfaction', id: 'satisfaction' },
  { section: 'Reports' },
  { icon: '📋', label: 'Reports',      id: 'reports' },
  { icon: '⚙️', label: 'Settings',    id: 'settings' },
]

export default function Sidebar({ activeNav, onNavChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">✈️</div>
        <h1>TourismAnalytics</h1>
        <p>Dashboard v2.4</p>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-label">{item.section}</div>
          ) : (
            <div
              key={item.id}
              className={`nav-item${activeNav === item.id ? ' active' : ''}`}
              onClick={() => onNavChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          )
        )}
      </nav>

      <div className="sidebar-footer">Last updated: June 2025 · UTC+0</div>
    </aside>
  )
}
