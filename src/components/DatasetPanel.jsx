import { useState, useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'
import {
  KPIS,
  TOP_DESTINATIONS,
  ORIGIN_DISTRIBUTION,
  AGE_DISTRIBUTION,
  PURPOSE_DIST,
  SPEND_BY_DEST,
  SEASONAL_DIST,
  GENDER_DIST,
  ACCOMM_DIST,
  STAY_BY_PURPOSE,
  VISITOR_TYPE_BY_SEASON,
  MONTHLY_ARRIVALS,
} from '../data/dataUtils.js'
import { TOURISM_RECORDS } from '../data/tourismRecords.js'

// ── tiny chart wrappers ──────────────────────────────────────────────────

function MiniDonut({ data, height = 220 }) {
  const option = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: { bottom: 0, textStyle: { fontSize: 10 }, type: 'scroll' },
    series: [{
      type: 'pie', radius: ['38%', '65%'], center: ['50%', '42%'],
      label: { fontSize: 10, formatter: '{b}\n{c}%' },
      data: data.map(d => ({ name: d.name, value: d.value })),
    }],
  }), [data])
  const ref = useEChart(option)
  return <div ref={ref} style={{ height }} />
}

function MiniBar({ labels, values, height = 220, color = '#1e6fb5', horizontal = false, formatter }) {
  const option = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: horizontal
      ? { left: 10, right: 50, top: 8, bottom: 8, containLabel: true }
      : { left: 10, right: 10, top: 8, bottom: 8, containLabel: true },
    xAxis: horizontal
      ? { type: 'value', axisLabel: { fontSize: 9, formatter } }
      : { type: 'category', data: labels, axisLabel: { fontSize: 10 } },
    yAxis: horizontal
      ? { type: 'category', data: labels, axisLabel: { fontSize: 10 } }
      : { type: 'value',    axisLabel: { fontSize: 9, formatter }, splitLine: { lineStyle: { color: '#f0f4f8' } } },
    series: [{
      type: 'bar',
      barMaxWidth: horizontal ? 16 : 30,
      data: values.map(v => ({
        value: v,
        itemStyle: { color, borderRadius: horizontal ? [0,4,4,0] : [4,4,0,0] },
      })),
      label: {
        show: true,
        position: horizontal ? 'right' : 'top',
        fontSize: 9, fontWeight: 700,
        formatter: p => formatter ? formatter(p.value) : p.value,
      },
    }],
  }), [labels, values, horizontal, color, formatter])
  const ref = useEChart(option)
  return <div ref={ref} style={{ height }} />
}

function MiniGroupedBar({ data, height = 220 }) {
  const option = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, textStyle: { fontSize: 10 } },
    grid: { left: 10, right: 10, top: 28, bottom: 8, containLabel: true },
    xAxis: { type: 'category', data: data.seasons, axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { fontSize: 9 }, splitLine: { lineStyle: { color: '#f0f4f8' } } },
    series: [
      { name: 'International', type: 'bar', barMaxWidth: 24, data: data.international, itemStyle: { color: '#1e6fb5' } },
      { name: 'Domestic',      type: 'bar', barMaxWidth: 24, data: data.domestic,      itemStyle: { color: '#0d9488' } },
    ],
  }), [data])
  const ref = useEChart(option)
  return <div ref={ref} style={{ height }} />
}

// ── Stat badge ───────────────────────────────────────────────────────────

function StatPill({ label, value, color = 'var(--accent)' }) {
  return (
    <div style={{
      background: 'var(--surface-alt)', borderRadius: 8, padding: '10px 16px',
      display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 20, fontWeight: 800, color }}>{value}</span>
    </div>
  )
}

// ── Record table ─────────────────────────────────────────────────────────

const HEADERS = [
  'Visitor ID','Date','Origin','Destination','Season',
  'Age','Gender','Type','Visitors','Stay','Purpose','Daily Spend','Total Spend','Accommodation',
]

function RecordRow({ r }) {
  return (
    <tr>
      <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{r.visitorId}</td>
      <td>{r.dateOfVisit}</td>
      <td>{r.originLocation}</td>
      <td>{r.destination}</td>
      <td>{r.season}</td>
      <td>{r.ageGroup}</td>
      <td>{r.gender}</td>
      <td>
        <span className={`badge ${r.visitorType === 'International' ? 'badge-blue' : 'badge-teal'}`}>
          {r.visitorType === 'International' ? 'Intl' : 'Dom'}
        </span>
      </td>
      <td style={{ textAlign: 'center' }}>{r.numberOfVisitors}</td>
      <td style={{ textAlign: 'center' }}>{r.lengthOfStay}d</td>
      <td style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={r.travelPurpose}>{r.travelPurpose}</td>
      <td style={{ textAlign: 'right', fontWeight: 700 }}>${r.avgDailySpend}</td>
      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--teal)' }}>${r.totalSpend.toLocaleString()}</td>
      <td style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={r.accommodationType}>{r.accommodationType}</td>
    </tr>
  )
}

// ── Main component ────────────────────────────────────────────────────────

const PAGE_SIZE = 15

export default function DatasetPanel() {
  const [tab,     setTab]     = useState('summary')
  const [page,    setPage]    = useState(0)
  const [search,  setSearch]  = useState('')
  const [typeFilter, setType] = useState('all')
  const [seasonFilter, setSeason] = useState('all')

  const filtered = useMemo(() => {
    let rows = TOURISM_RECORDS
    if (search)            rows = rows.filter(r =>
      r.destination.toLowerCase().includes(search.toLowerCase()) ||
      r.originLocation.toLowerCase().includes(search.toLowerCase()) ||
      r.visitorId.toLowerCase().includes(search.toLowerCase())
    )
    if (typeFilter !== 'all')   rows = rows.filter(r => r.visitorType === typeFilter)
    if (seasonFilter !== 'all') rows = rows.filter(r => r.season === seasonFilter)
    return rows
  }, [search, typeFilter, seasonFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageRows   = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const tabs = [
    { id: 'summary',  label: 'Summary Stats' },
    { id: 'charts',   label: 'Dataset Charts' },
    { id: 'records',  label: `Records (${TOURISM_RECORDS.length.toLocaleString()})` },
  ]

  return (
    <div className="card" style={{ marginTop: 8 }}>
      <div className="card-header">
        <div>
          <div className="card-title">📂 Tourism Dataset Explorer</div>
          <div className="card-sub">
            1 000 synthetic records · 14 fields · generated for dashboard demonstration
          </div>
        </div>
        <a
          href="/tourism_dataset.csv"
          download="tourism_dataset.csv"
          className="btn btn-outline"
          style={{ textDecoration: 'none' }}
        >
          ⬇ Download CSV
        </a>
      </div>

      {/* Tab bar */}
      <div style={{ padding: '8px 20px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="tab-nav" style={{ display: 'inline-flex' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`tab-btn${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-body">

        {/* ── Summary tab ──────────────────────────────── */}
        {tab === 'summary' && (
          <>
            {/* KPI pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10, marginBottom: 20 }}>
              <StatPill label="Total Records"        value={KPIS.totalRecords.toLocaleString()} />
              <StatPill label="Total Visitors"       value={KPIS.totalVisitors.toLocaleString()} color="var(--teal)" />
              <StatPill label="International"        value={`${KPIS.internationalCount} (${KPIS.internationalPct}%)`} color="var(--accent)" />
              <StatPill label="Domestic"             value={`${KPIS.domesticCount} (${KPIS.domesticPct}%)`} color="var(--teal)" />
              <StatPill label="Avg. Stay"            value={`${KPIS.avgLengthOfStay} days`} color="var(--amber)" />
              <StatPill label="Avg. Daily Spend"     value={`$${KPIS.avgDailySpend}`} color="var(--green)" />
              <StatPill label="Total Revenue"        value={`$${(KPIS.totalRevenue / 1e6).toFixed(1)}M`} color="var(--rose)" />
            </div>

            {/* Schema table */}
            <div style={{ marginBottom: 16 }}>
              <div className="card-title" style={{ marginBottom: 10 }}>Dataset Schema</div>
              <table className="dest-table" style={{ fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Field</th>
                    <th style={{ textAlign: 'left' }}>Type</th>
                    <th style={{ textAlign: 'left' }}>Sample Value</th>
                    <th style={{ textAlign: 'left' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Visitor ID',               'String',  'TVA-00042',            'Unique identifier for each record'],
                    ['Date of Visit',             'Date',    '2024-07-15',           'ISO-8601 date of arrival at destination'],
                    ['Country/State of Origin',   'String',  'Germany',              'Visitor\'s home country or state'],
                    ['Destination',               'String',  'Paris, France',        'City and country visited'],
                    ['Season',                    'Enum',    'Summer',               'Spring | Summer | Autumn | Winter'],
                    ['Age Group',                 'Enum',    '25–34',                '18–24 | 25–34 | 35–44 | 45–54 | 55–64 | 65+'],
                    ['Gender',                    'Enum',    'Female',               'Male | Female | Non-binary'],
                    ['Visitor Type',              'Enum',    'International',        'International | Domestic'],
                    ['Number of Visitors',        'Integer', '2',                    'Party/group size'],
                    ['Length of Stay',            'Integer', '7',                    'Number of nights at destination'],
                    ['Travel Purpose',            'String',  'Leisure / Holiday',    'Reason for the trip'],
                    ['Average Daily Spend',       'USD',     '$195',                 'Spend per person per day (USD)'],
                    ['Total Spend',               'USD',     '$2,730',               'Full trip expenditure incl. group size'],
                    ['Accommodation Type',        'String',  'Hotel (4-star)',        'Type of lodging used'],
                  ].map(([field, type, sample, desc]) => (
                    <tr key={field}>
                      <td><strong>{field}</strong></td>
                      <td><span className="badge badge-blue">{type}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--teal)' }}>{sample}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top destinations from dataset */}
            <div className="card-title" style={{ marginBottom: 10 }}>Top 10 Destinations (by record count)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TOP_DESTINATIONS.map(([dest, count], i) => (
                <div key={dest} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 20, fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 13 }}>{dest}</span>
                  <div style={{ width: 180, height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4, background: 'var(--accent)',
                      width: `${(count / TOP_DESTINATIONS[0][1]) * 100}%`,
                    }} />
                  </div>
                  <span style={{ width: 32, textAlign: 'right', fontSize: 12, fontWeight: 700 }}>{count}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Charts tab ───────────────────────────────── */}
        {tab === 'charts' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            <div>
              <div className="card-title" style={{ marginBottom: 6 }}>Purpose Distribution</div>
              <div className="card-sub" style={{ marginBottom: 8 }}>From {TOURISM_RECORDS.length} records</div>
              <MiniDonut data={PURPOSE_DIST} height={230} />
            </div>

            <div>
              <div className="card-title" style={{ marginBottom: 6 }}>Accommodation Type</div>
              <div className="card-sub" style={{ marginBottom: 8 }}>Share of records by lodging</div>
              <MiniDonut data={ACCOMM_DIST} height={230} />
            </div>

            <div>
              <div className="card-title" style={{ marginBottom: 6 }}>Gender Distribution</div>
              <div className="card-sub" style={{ marginBottom: 8 }}>% of all visitors</div>
              <MiniDonut data={GENDER_DIST} height={200} />
            </div>

            <div>
              <div className="card-title" style={{ marginBottom: 6 }}>Seasonal Visits</div>
              <div className="card-sub" style={{ marginBottom: 8 }}>Total visitors by season</div>
              <MiniBar
                labels={SEASONAL_DIST.map(d => d.name)}
                values={SEASONAL_DIST.map(d => d.value)}
                height={200}
                color="#1e6fb5"
              />
            </div>

            <div>
              <div className="card-title" style={{ marginBottom: 6 }}>Avg Daily Spend by Destination</div>
              <div className="card-sub" style={{ marginBottom: 8 }}>USD per visitor per day (top 10)</div>
              <MiniBar
                labels={SPEND_BY_DEST.labels}
                values={SPEND_BY_DEST.values}
                height={230}
                color="#0d9488"
                horizontal
                formatter={v => '$' + v}
              />
            </div>

            <div>
              <div className="card-title" style={{ marginBottom: 6 }}>Avg Length of Stay by Purpose</div>
              <div className="card-sub" style={{ marginBottom: 8 }}>Mean nights per trip</div>
              <MiniBar
                labels={STAY_BY_PURPOSE.map(d => d.purpose.replace(' / ', '/').replace(' & ', '&').split(' ')[0])}
                values={STAY_BY_PURPOSE.map(d => d.avg)}
                height={230}
                color="#d97706"
                horizontal
                formatter={v => v + 'd'}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div className="card-title" style={{ marginBottom: 6 }}>International vs. Domestic by Season</div>
              <div className="card-sub" style={{ marginBottom: 8 }}>Record counts per season split by visitor type</div>
              <MiniGroupedBar data={VISITOR_TYPE_BY_SEASON} height={220} />
            </div>

          </div>
        )}

        {/* ── Records tab ──────────────────────────────── */}
        {tab === 'records' && (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search destination, origin, ID…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0) }}
                style={{
                  flex: 1, minWidth: 200, padding: '6px 10px',
                  border: '1px solid var(--border)', borderRadius: 8,
                  fontSize: 12, outline: 'none',
                }}
              />
              <select className="filter-select" value={typeFilter}
                onChange={e => { setType(e.target.value); setPage(0) }}>
                <option value="all">All Types</option>
                <option value="International">International</option>
                <option value="Domestic">Domestic</option>
              </select>
              <select className="filter-select" value={seasonFilter}
                onChange={e => { setSeason(e.target.value); setPage(0) }}>
                <option value="all">All Seasons</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
              </select>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {filtered.length.toLocaleString()} records
              </span>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="dest-table" style={{ fontSize: 12, minWidth: 1100 }}>
                <thead>
                  <tr>
                    {HEADERS.map(h => <th key={h} style={{ whiteSpace: 'nowrap' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map(r => <RecordRow key={r.visitorId} r={r} />)}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, justifyContent: 'center' }}>
              <button className="btn btn-outline" disabled={page === 0}
                onClick={() => setPage(p => p - 1)} style={{ padding: '4px 12px' }}>
                ← Prev
              </button>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Page {page + 1} / {totalPages}
              </span>
              <button className="btn btn-outline" disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)} style={{ padding: '4px 12px' }}>
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
