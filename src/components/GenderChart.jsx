import { useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'

const GENDER_COLORS  = { Male: '#3b82f6', Female: '#f472b6', 'Non-binary': '#a78bfa' }
const GENDER_ICONS   = { Male: '♂', Female: '♀', 'Non-binary': '⚧' }

export default function GenderChart({ chartData }) {
  const { genderData = [] } = chartData ?? {}
  const total = genderData.reduce((s, d) => s + d.value, 0)

  const option = useMemo(() => {
    if (!genderData.length) return {}
    return {
      tooltip: {
        trigger: 'item',
        formatter: p => {
          const pct = total ? ((p.value / total) * 100).toFixed(1) : 0
          return `${GENDER_ICONS[p.name] ?? ''} <b>${p.name}</b><br/>
            Visitors: <b>${p.value.toLocaleString()}</b><br/>Share: <b>${pct}%</b>`
        },
      },
      legend: {
        bottom: 0, textStyle: { fontSize: 11, color: '#5a6a7a' }, icon: 'circle',
        formatter: name => {
          const d = genderData.find(x => x.name === name)
          const pct = d && total ? ((d.value / total) * 100).toFixed(1) : 0
          return `${GENDER_ICONS[name] ?? ''} ${name}  ${pct}%`
        },
      },
      series: [{
        type: 'pie',
        roseType: 'radius',        // nightingale / rose chart
        radius: ['20%', '68%'],
        center: ['50%', '44%'],
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: {
          show: true, position: 'outside',
          formatter: p => `${GENDER_ICONS[p.name] ?? ''} ${p.name}\n${((p.value / (total || 1)) * 100).toFixed(1)}%`,
          fontSize: 11, fontWeight: 600, color: '#1a2332',
        },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 700 },
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' },
        },
        data: genderData.map(d => ({
          name: d.name, value: d.value,
          itemStyle: { color: GENDER_COLORS[d.name] ?? '#94a3b8' },
        })),
      }],
    }
  }, [genderData, total])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Visitors by Gender</div>
          <div className="card-sub">Nightingale rose chart — visitor gender split</div>
        </div>
        <span className="badge badge-blue">Demographics</span>
      </div>
      <div className="card-body">
        <div ref={useEChart(option)} style={{ height: 260 }} />
      </div>
    </div>
  )
}
