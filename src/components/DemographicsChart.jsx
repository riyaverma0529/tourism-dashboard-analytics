import { useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'

const AGE_COLORS = ['#bfdbfe','#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8']

export default function DemographicsChart({ chartData }) {
  const { ageGroupData = [] } = chartData ?? {}

  const total = ageGroupData.reduce((s, d) => s + d.value, 0)

  const option = useMemo(() => {
    if (!ageGroupData.length) return {}
    return {
      tooltip: {
        trigger: 'item',
        formatter: p => {
          const pct = total ? ((p.value / total) * 100).toFixed(1) : 0
          return `<b>${p.name}</b><br/>Visitors: <b>${p.value.toLocaleString()}</b><br/>Share: <b>${pct}%</b>`
        },
      },
      legend: {
        orient: 'vertical', right: 8, top: 'center',
        textStyle: { fontSize: 11, color: '#5a6a7a' },
        formatter: name => {
          const d = ageGroupData.find(x => x.name === name)
          const pct = d && total ? ((d.value / total) * 100).toFixed(1) : 0
          return `${name}  ${pct}%`
        },
      },
      series: [{
        type: 'pie',
        radius: ['48%', '72%'],
        center: ['36%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: {
          show: true, position: 'inside',
          formatter: p => `${((p.value / (total || 1)) * 100).toFixed(0)}%`,
          fontSize: 11, fontWeight: 700, color: '#fff',
        },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 700 },
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' },
        },
        data: ageGroupData.map((d, i) => ({
          name: d.name, value: d.value,
          itemStyle: { color: AGE_COLORS[i % AGE_COLORS.length] },
        })),
      }],
    }
  }, [ageGroupData, total])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Demographics by Age Group</div>
          <div className="card-sub">Visitor distribution across age brackets</div>
        </div>
        <span className="badge badge-blue">Demographics</span>
      </div>
      <div className="card-body">
        <div ref={useEChart(option)} style={{ height: 260 }} />
      </div>
    </div>
  )
}
