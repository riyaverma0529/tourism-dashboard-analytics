import { useState, useMemo } from 'react'

import Sidebar            from './components/Sidebar.jsx'
import Topbar             from './components/Topbar.jsx'
import KpiCards           from './components/KpiCards.jsx'
import ArrivalsChart      from './components/ArrivalsChart.jsx'
import DestinationsBarChart from './components/DestinationsBarChart.jsx'
import SeasonalAreaChart  from './components/SeasonalAreaChart.jsx'
import DemographicsChart  from './components/DemographicsChart.jsx'
import DomIntlDonut       from './components/DomIntlDonut.jsx'
import GenderChart        from './components/GenderChart.jsx'
import OriginMapChart     from './components/OriginMapChart.jsx'
import SpendChart         from './components/SpendChart.jsx'
import StayByDestChart    from './components/StayByDestChart.jsx'
import InsightsPanel      from './components/InsightsPanel.jsx'
import OccupancyHeatmap   from './components/OccupancyHeatmap.jsx'
import SatisfactionCard   from './components/SatisfactionCard.jsx'
import RadarChart         from './components/RadarChart.jsx'
import ScatterChart       from './components/ScatterChart.jsx'
import PurposeChart       from './components/PurposeChart.jsx'
import DatasetPanel       from './components/DatasetPanel.jsx'

import { computeFilteredChartData } from './data/dataUtils.js'

// ── Default filter state — all dimensions set to 'all' ───────────────────
const DEFAULT_FILTERS = {
  year: 'all', month: 'all', destination: 'all',
  season: 'all', visitorType: 'all', origin: 'all',
  ageGroup: 'all', gender: 'all', purpose: 'all',
}

// ── Section header ────────────────────────────────────────────────────────
function SectionHeader({ title, badge, badgeClass, children, style }) {
  return (
    <div className="section-header" style={style}>
      <h2>{title}</h2>
      <div className="section-divider" />
      {badge && <span className={`badge ${badgeClass ?? 'badge-blue'}`}>{badge}</span>}
      {children}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [filters,   setFilters]   = useState(DEFAULT_FILTERS)
  const [activeNav, setActiveNav] = useState('dashboard')

  // Count how many filters are active (not 'all')
  const activeCount = useMemo(
    () => Object.values(filters).filter(v => v !== 'all').length,
    [filters]
  )

  // Derive all chart data from filtered records — single useMemo for all charts
  const chartData = useMemo(
    () => computeFilteredChartData(filters),
    [filters]
  )

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS)
  }

  return (
    <div className="layout">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="main">
        <Topbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          activeCount={activeCount}
        />

        <main className="content">

          {/* ── KPI Row ─────────────────────────────────── */}
          <KpiCards filters={filters} />

          {/* ── Arrivals & Seasonal Trends ──────────────── */}
          <SectionHeader
            title="Arrivals &amp; Seasonal Trends"
            badge={`${chartData.totalRows} records`}
            badgeClass="badge-blue"
          />
          <div className="charts-row col-2" style={{ marginBottom: 16 }}>
            <ArrivalsChart chartData={chartData} />
            <SeasonalAreaChart chartData={chartData} />
          </div>

          {/* ── Destinations ────────────────────────────── */}
          <SectionHeader
            title="Destinations"
            style={{ marginTop: 8 }}
          />
          <div className="charts-row col-2" style={{ marginBottom: 16 }}>
            <DestinationsBarChart chartData={chartData} />
            <OriginMapChart chartData={chartData} />
          </div>

          {/* ── Demographics ────────────────────────────── */}
          <SectionHeader
            title="Visitor Demographics"
            style={{ marginTop: 8 }}
          />
          <div className="charts-row col-3" style={{ marginBottom: 16 }}>
            <DemographicsChart chartData={chartData} />
            <DomIntlDonut chartData={chartData} />
            <GenderChart chartData={chartData} />
          </div>

          {/* ── Spend & Stay ────────────────────────────── */}
          <SectionHeader
            title="Spend &amp; Length of Stay"
            style={{ marginTop: 8 }}
          />
          <div className="charts-row col-2" style={{ marginBottom: 16 }}>
            <SpendChart chartData={chartData} />
            <StayByDestChart chartData={chartData} />
          </div>

          {/* ── Additional Analytics ────────────────────── */}
          <SectionHeader
            title="Additional Analytics"
            style={{ marginTop: 8 }}
          />
          <div className="charts-row col-3" style={{ marginBottom: 16 }}>
            <PurposeChart />
            <SatisfactionCard />
            <RadarChart />
          </div>
          <div className="charts-row col-2" style={{ marginBottom: 16 }}>
            <OccupancyHeatmap />
            <ScatterChart />
          </div>

          {/* ── Tourism Insights ────────────────────────── */}
          <SectionHeader
            title="Tourism Insights"
            badge="Auto-generated"
            badgeClass="badge-green"
            style={{ marginTop: 8 }}
          />
          <InsightsPanel chartData={chartData} />

          {/* ── Dataset Explorer ────────────────────────── */}
          <SectionHeader
            title="Dataset Explorer"
            badge="1 000 Records"
            badgeClass="badge-teal"
            style={{ marginTop: 8 }}
          />
          <DatasetPanel />

        </main>
      </div>
    </div>
  )
}
