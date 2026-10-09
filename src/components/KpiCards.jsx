import { useMemo, useRef, useEffect } from 'react'
import { computeFilteredKpis } from '../data/dataUtils.js'

// ── Animated counter hook ─────────────────────────────────────────────────
function useCountUp(target, isNumeric) {
  const ref    = useRef(null)
  const prevRef = useRef(target)

  useEffect(() => {
    if (!isNumeric || !ref.current) {
      prevRef.current = target
      return
    }
    const from     = prevRef.current
    const to       = target
    prevRef.current = target
    if (from === to) return

    const duration = 600
    const start    = performance.now()

    function step(now) {
      const progress = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const eased  = 1 - Math.pow(1 - progress, 3)
      const current = from + (to - from) * eased
      if (ref.current) ref.current.textContent = formatNum(current, to)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, isNumeric])

  return ref
}

function formatNum(current, target) {
  if (target >= 1_000_000) return (current / 1_000_000).toFixed(2) + 'M'
  if (target >= 1_000)     return Math.round(current).toLocaleString()
  return Number.isInteger(target) ? Math.round(current).toString() : current.toFixed(1)
}

// ── Trend indicator (sparkline-style inline badge) ────────────────────────
function TrendBadge({ value, suffix = '', prevValue, dir }) {
  if (prevValue == null || prevValue === value) {
    return <span className="kpi-delta flat">— no change</span>
  }
  const pct = prevValue > 0
    ? (((value - prevValue) / prevValue) * 100).toFixed(1)
    : null
  const up  = value >= prevValue
  return (
    <span className={`kpi-delta ${up ? 'up' : 'down'}`}>
      {up ? '▲' : '▼'} {pct != null ? `${Math.abs(pct)}%` : `${Math.abs(value - prevValue)}${suffix}`}
    </span>
  )
}

// ── Single KPI card ───────────────────────────────────────────────────────
function KpiCard({ color, icon, label, rawValue, displayValue, unit, sub, prevValue, isNumeric = true, wide = false }) {
  const counterRef = useCountUp(rawValue, isNumeric)

  return (
    <div className={`kpi-card kpi-card-v2 ${color}${wide ? ' wide' : ''}`}>
      <span className="kpi-card-icon" aria-hidden="true">{icon}</span>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {isNumeric
          ? <span ref={counterRef}>{displayValue}</span>
          : <span className="kpi-value-text">{displayValue}</span>
        }
        {unit && <small> {unit}</small>}
      </div>
      <div className="kpi-meta">
        {isNumeric
          ? <TrendBadge value={rawValue} prevValue={prevValue} />
          : <span className="kpi-delta flat">Most visited</span>
        }
        <span className="kpi-sub">{sub}</span>
      </div>
    </div>
  )
}

// ── Sub-bar (domestic / international split) ──────────────────────────────
function SplitBar({ domPct, intlPct }) {
  return (
    <div className="kpi-split-bar" title={`Domestic ${domPct}% · International ${intlPct}%`}>
      <div className="kpi-split-dom"  style={{ width: `${domPct}%`  }} />
      <div className="kpi-split-intl" style={{ width: `${intlPct}%` }} />
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────
const DEFAULT_FILTERS = { year: '2024', region: 'all', type: 'all' }

export default function KpiCards({ filters }) {
  // Compute current KPIs from filtered dataset
  const kpi = useMemo(() => computeFilteredKpis(filters), [filters])

  // Compute previous-year KPIs for delta indicators
  const prevFilters = useMemo(() => {
    const prevYear = String(parseInt(filters.year, 10) - 1)
    return { ...filters, year: prevYear }
  }, [filters])
  const prevKpi = useMemo(() => computeFilteredKpis(prevFilters), [prevFilters])

  const fmtVisitors = v => v >= 1_000_000
    ? (v / 1_000_000).toFixed(2) + 'M'
    : v.toLocaleString()

  const destShort = kpi.mostPopularDest.replace(/, .+$/, '') // strip country

  return (
    <div className="kpi-grid kpi-grid-6">

      {/* 1 — Total Visitors */}
      <KpiCard
        color="blue"
        icon="👥"
        label="Total Visitors"
        rawValue={kpi.totalVisitors}
        displayValue={fmtVisitors(kpi.totalVisitors)}
        sub={`${kpi.recordCount.toLocaleString()} records matched`}
        prevValue={prevKpi.totalVisitors}
      />

      {/* 2 — Domestic Visitors */}
      <KpiCard
        color="teal"
        icon="🏠"
        label="Domestic Visitors"
        rawValue={kpi.domesticVisitors}
        displayValue={fmtVisitors(kpi.domesticVisitors)}
        sub={`${kpi.domesticPct}% of total`}
        prevValue={prevKpi.domesticVisitors}
      />

      {/* 3 — International Visitors */}
      <KpiCard
        color="indigo"
        icon="✈"
        label="International Visitors"
        rawValue={kpi.internationalVisitors}
        displayValue={fmtVisitors(kpi.internationalVisitors)}
        sub={`${kpi.internationalPct}% of total`}
        prevValue={prevKpi.internationalVisitors}
      />

      {/* 4 — Most Popular Destination */}
      <KpiCard
        color="amber"
        icon="📍"
        label="Top Destination"
        rawValue={0}
        displayValue={destShort}
        sub={kpi.mostPopularDest}
        isNumeric={false}
      />

      {/* 5 — Avg Length of Stay */}
      <KpiCard
        color="rose"
        icon="🌙"
        label="Avg. Length of Stay"
        rawValue={kpi.avgLengthOfStay}
        displayValue={kpi.avgLengthOfStay}
        unit="days"
        sub="per trip"
        prevValue={prevKpi.avgLengthOfStay}
      />

      {/* 6 — Avg Daily Spend */}
      <KpiCard
        color="green"
        icon="💵"
        label="Avg. Daily Spend"
        rawValue={kpi.avgDailySpend}
        displayValue={`$${kpi.avgDailySpend}`}
        sub="USD per visitor per day"
        prevValue={prevKpi.avgDailySpend}
      />

      {/* Visitor split bar — full width */}
      <div className="kpi-split-row">
        <span className="kpi-split-label dom">🏠 Domestic {kpi.domesticPct}%</span>
        <SplitBar domPct={kpi.domesticPct} intlPct={kpi.internationalPct} />
        <span className="kpi-split-label intl">✈ International {kpi.internationalPct}%</span>
      </div>

    </div>
  )
}
