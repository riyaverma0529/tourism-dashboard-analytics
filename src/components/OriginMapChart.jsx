import { useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'

const FLAG_MAP = {
  'China':'🇨🇳','United States':'🇺🇸','Germany':'🇩🇪','United Kingdom':'🇬🇧',
  'France':'🇫🇷','Russia':'🇷🇺','India':'🇮🇳','Japan':'🇯🇵','Canada':'🇨🇦',
  'Australia':'🇦🇺','Brazil':'🇧🇷','South Korea':'🇰🇷','Italy':'🇮🇹','Spain':'🇪🇸',
  'Netherlands':'🇳🇱','Saudi Arabia':'🇸🇦','Turkey':'🇹🇷','Mexico':'🇲🇽',
  'Argentina':'🇦🇷','Sweden':'🇸🇪',
}

const ORIGIN_PALETTE = [
  '#1e6fb5','#0d9488','#d97706','#7c3aed','#e11d48',
  '#059669','#f59e0b','#6366f1','#14b8a6','#64748b',
]

export default function OriginMapChart({ chartData }) {
  const { originData = [] } = chartData ?? {}
  const total = originData.reduce((s, d) => s + d.count, 0)

  const option = useMemo(() => {
    if (!originData.length) return {}
    const sorted = [...originData].sort((a, b) => a.count - b.count) // ascending for horizontal bar
    return {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: p => {
          const d = originData.find(x => x.country === p[0].name)
          const pct = d && total ? ((d.count / total) * 100).toFixed(1) : 0
          const flag = FLAG_MAP[p[0].name] ?? '🌍'
          return `${flag} <b>${p[0].name}</b><br/>Visitors: <b>${p[0].value.toLocaleString()}</b><br/>Share: <b>${pct}%</b>`
        },
      },
      grid: { left: 10, right: 70, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: '#5a6a7a', formatter: v => v.toLocaleString() },
        splitLine: { lineStyle: { color: '#f0f4f8', type: 'dashed' } },
        axisLine: { show: false }, axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: sorted.map(d => (FLAG_MAP[d.country] ?? '🌍') + ' ' + d.country),
        axisLabel: { fontSize: 11, color: '#1a2332' },
        axisLine: { lineStyle: { color: '#dde3ea' } },
        axisTick: { show: false },
      },
      series: [{
        type: 'bar', barMaxWidth: 18,
        data: sorted.map((d, i) => ({
          value: d.count,
          itemStyle: {
            color: ORIGIN_PALETTE[i % ORIGIN_PALETTE.length],
            borderRadius: [0, 6, 6, 0],
          },
        })),
        label: {
          show: true, position: 'right',
          formatter: p => {
            const pct = total ? ((p.value / total) * 100).toFixed(1) : 0
            return `${p.value.toLocaleString()}  (${pct}%)`
          },
          fontSize: 10, fontWeight: 700, color: '#1a2332',
        },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.2)' } },
      }],
    }
  }, [originData, total])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Visitor Origin — Geographic Analysis</div>
          <div className="card-sub">Top source markets for international visitors</div>
        </div>
        <span className="badge badge-blue">Origin</span>
      </div>
      <div className="card-body">
        <div ref={useEChart(option)} style={{ height: 320 }} />
      </div>
    </div>
  )
}
