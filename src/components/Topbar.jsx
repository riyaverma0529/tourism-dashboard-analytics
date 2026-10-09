import { useState } from 'react'
import {
  ALL_YEARS, ALL_MONTHS, ALL_DESTS, ALL_ORIGINS, ALL_PURPOSES,
  SEASONS_ORDERED, AGE_GROUPS_ORDERED, GENDERS_ORDERED,
} from '../data/dataUtils.js'

const CHEVRON = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

function FilterSelect({ label, value, onChange, children }) {
  return (
    <div className="filter-item">
      <label className="filter-label">{label}</label>
      <div className="filter-select-wrap">
        <select className="filter-select" value={value} onChange={e => onChange(e.target.value)}>
          {children}
        </select>
        <span className="filter-chevron">{CHEVRON}</span>
      </div>
    </div>
  )
}

export default function Topbar({ filters, onFilterChange, onReset, activeCount }) {
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="topbar-title">Tourism &amp; Visitor Analytics</div>
        <div className="topbar-sub">
          Worldwide · {filters.year !== 'all' ? filters.year : 'All Years'} ·{' '}
          {activeCount > 0
            ? <span className="active-filter-count">{activeCount} filter{activeCount > 1 ? 's' : ''} active</span>
            : 'No filters applied'}
        </div>
      </div>

      <div className="topbar-actions">
        {/* Mobile toggle */}
        <button className="btn btn-outline filter-toggle-btn" onClick={() => setPanelOpen(p => !p)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6"  x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="16" y2="18"/>
          </svg>
          Filters {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
        </button>
        {activeCount > 0 && (
          <button className="btn btn-outline" onClick={onReset}>Reset All</button>
        )}
        <button className="btn btn-primary" onClick={() => window.print()}>⬇ Export</button>
      </div>

      {/* Full filter panel */}
      <div className={`filter-panel${panelOpen ? ' open' : ''}`}>
        <div className="filter-panel-grid">

          <FilterSelect label="Year" value={filters.year} onChange={v => onFilterChange('year', v)}>
            <option value="all">All Years</option>
            {ALL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </FilterSelect>

          <FilterSelect label="Month" value={filters.month} onChange={v => onFilterChange('month', v)}>
            <option value="all">All Months</option>
            {ALL_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </FilterSelect>

          <FilterSelect label="Season" value={filters.season} onChange={v => onFilterChange('season', v)}>
            <option value="all">All Seasons</option>
            {SEASONS_ORDERED.map(s => <option key={s} value={s}>{s}</option>)}
          </FilterSelect>

          <FilterSelect label="Destination" value={filters.destination} onChange={v => onFilterChange('destination', v)}>
            <option value="all">All Destinations</option>
            {ALL_DESTS.map(d => <option key={d} value={d}>{d}</option>)}
          </FilterSelect>

          <FilterSelect label="Visitor Type" value={filters.visitorType} onChange={v => onFilterChange('visitorType', v)}>
            <option value="all">All Types</option>
            <option value="International">International</option>
            <option value="Domestic">Domestic</option>
          </FilterSelect>

          <FilterSelect label="Origin" value={filters.origin} onChange={v => onFilterChange('origin', v)}>
            <option value="all">All Origins</option>
            {ALL_ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
          </FilterSelect>

          <FilterSelect label="Age Group" value={filters.ageGroup} onChange={v => onFilterChange('ageGroup', v)}>
            <option value="all">All Ages</option>
            {AGE_GROUPS_ORDERED.map(a => <option key={a} value={a}>{a}</option>)}
          </FilterSelect>

          <FilterSelect label="Gender" value={filters.gender} onChange={v => onFilterChange('gender', v)}>
            <option value="all">All Genders</option>
            {GENDERS_ORDERED.map(g => <option key={g} value={g}>{g}</option>)}
          </FilterSelect>

          <FilterSelect label="Travel Purpose" value={filters.purpose} onChange={v => onFilterChange('purpose', v)}>
            <option value="all">All Purposes</option>
            {ALL_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
          </FilterSelect>

        </div>

        {/* Active-filter chips */}
        {activeCount > 0 && (
          <div className="filter-chips">
            {Object.entries(filters).filter(([, v]) => v !== 'all').map(([key, val]) => (
              <span key={key} className="filter-chip">
                <span className="chip-key">{key.replace(/([A-Z])/g,' $1').toLowerCase()}</span>
                <span className="chip-val">{val}</span>
                <button className="chip-remove" onClick={() => onFilterChange(key, 'all')}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
