const INSIGHT_DEFS = [
  {
    key: 'peakSeason',
    icon: '☀️',
    title: 'Peak Tourism Season',
    color: 'amber',
    getValue: i => i.peakSeason,
    getSub:   i => `${i.peakSeasonVisitors.toLocaleString()} visitors`,
    getDesc:  i => `The highest visitor volume occurs in <b>${i.peakSeason}</b>. Plan capacity and marketing campaigns around this peak window.`,
  },
  {
    key: 'mostVisited',
    icon: '📍',
    title: 'Most Visited Destination',
    color: 'blue',
    getValue: i => i.mostVisited.replace(/, .+$/, ''),
    getSub:   i => i.mostVisited,
    getDesc:  i => `<b>${i.mostVisited}</b> leads with <b>${i.mostVisitedCount.toLocaleString()}</b> visitors under current filters. Infrastructure investment and tourist services should be prioritised here.`,
  },
  {
    key: 'fastestGrowing',
    icon: '📈',
    title: 'Fastest-Growing Destination',
    color: 'green',
    getValue: i => i.fastestGrowing || '—',
    getSub:   i => i.fastestGrowingPct > 0 ? `+${i.fastestGrowingPct}% YoY` : 'Insufficient data',
    getDesc:  i => i.fastestGrowingPct > 0
      ? `<b>${i.fastestGrowing}</b> shows <b>+${i.fastestGrowingPct}%</b> year-on-year growth — the strongest momentum in the current filtered view.`
      : 'Not enough year-over-year data for the current filter selection.',
  },
  {
    key: 'majorAgeGroup',
    icon: '👥',
    title: 'Major Visitor Demographic',
    color: 'indigo',
    getValue: i => i.majorAgeGroup,
    getSub:   i => 'Largest age segment',
    getDesc:  i => `Visitors aged <b>${i.majorAgeGroup}</b> represent the dominant demographic. Tailor experiences — tours, dining, accommodations — to this cohort to maximise satisfaction.`,
  },
  {
    key: 'domIntlTrend',
    icon: '🌍',
    title: 'Domestic vs International Trend',
    color: 'teal',
    getValue: i => i.domIntlTrend.split(' ')[0],
    getSub:   i => i.domIntlTrend,
    getDesc:  i => `Current visitor composition: <b>${i.domIntlTrend}</b>. ${
      i.domIntlTrend.startsWith('International')
        ? 'Invest in multilingual support, international marketing, and visa facilitation.'
        : 'Focus on domestic travel promotions, regional transport links, and local experience packages.'
    }`,
  },
  {
    key: 'highSpendDest',
    icon: '💵',
    title: 'Highest Average Spending',
    color: 'rose',
    getValue: i => i.highSpendDest.replace(/, .+$/, ''),
    getSub:   i => `$${i.highSpendAvg}/day avg`,
    getDesc:  i => `Visitors to <b>${i.highSpendDest}</b> spend an average of <b>$${i.highSpendAvg}/day</b> — the highest in this dataset. Premium tourism products and luxury positioning are key revenue drivers here.`,
  },
]

const COLOR_MAP = {
  amber:  { bg: 'var(--amber-light)',  border: 'var(--amber)', text: 'var(--amber)'  },
  blue:   { bg: 'var(--accent-light)', border: 'var(--accent)', text: 'var(--accent)' },
  green:  { bg: 'var(--green-light)',  border: 'var(--green)', text: 'var(--green)'  },
  indigo: { bg: '#ede9fe',             border: '#7c3aed',       text: '#7c3aed'       },
  teal:   { bg: 'var(--teal-light)',   border: 'var(--teal)',   text: 'var(--teal)'   },
  rose:   { bg: 'var(--rose-light)',   border: 'var(--rose)',   text: 'var(--rose)'   },
}

function InsightCard({ def, insights }) {
  const c = COLOR_MAP[def.color]
  return (
    <div className="insight-card" style={{ borderTopColor: c.border }}>
      <div className="insight-header">
        <span className="insight-icon" style={{ background: c.bg, color: c.text }}>{def.icon}</span>
        <div>
          <div className="insight-title">{def.title}</div>
          <div className="insight-value" style={{ color: c.text }}>{def.getValue(insights)}</div>
          <div className="insight-sub">{def.getSub(insights)}</div>
        </div>
      </div>
      <p
        className="insight-desc"
        dangerouslySetInnerHTML={{ __html: def.getDesc(insights) }}
      />
    </div>
  )
}

export default function InsightsPanel({ chartData }) {
  const { insights } = chartData ?? {}
  if (!insights) return null

  return (
    <div className="insights-panel">
      <div className="insights-grid">
        {INSIGHT_DEFS.map(def => (
          <InsightCard key={def.key} def={def} insights={insights} />
        ))}
      </div>
    </div>
  )
}
