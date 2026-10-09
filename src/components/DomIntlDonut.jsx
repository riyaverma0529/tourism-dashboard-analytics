import { useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'

const COLORS = ['#0d9488', '#1e6fb5']

export default function DomIntlDonut({ chartData }) {
  const { domIntlData = [] } = chartData ?? {}
  const total = domIntlData.reduce((s, d) => s + d.value, 0)

  const option = useMemo(() => {
    if (!domIntlData.length) return {}
    return {
      tooltip: {
        trigger: 'item',
        formatter: p => {
          const pct = total ? ((p.value / total) * 100).toFixed(1) : 0
          return `<b>${p.name}</b><br/>Visitors: <b>${p.value.toLocaleString()}</b><br/>Share: <b>${pct}%</b>`
        },
      },
      legend: {
        bottom: 0, textStyle: { fontSize: 11, color: '#5a6a7a' }, icon: 'circle',
        formatter: name => {
          const d = domIntlData.find(x => x.name === name)
          const pct = d && total ? ((d.value / total) * 100).toFixed(1) : 0
          return `${name}  (${pct}%)`
        },
      },
      series: [{
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['50%', '42%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 3 },
        label: {
          show: true,
          formatter: p => `{bold|${((p.value / (total || 1)) * 100).toFixed(1)}%}\n{name|${p.name}}`,
          rich: {
            bold: { fontSize: 14, fontWeight: 800, color: '#1a2332', lineHeight: 20 },
            name: { fontSize: 10, color: '#5a6a7a', lineHeight: 16 },
          },
        },
        emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.2)' }, scale: true, scaleSize: 6 },
        data: domIntlData.map((d, i) => ({
          name: d.name, value: d.value,
          itemStyle: { color: COLORS[i % COLORS.length] },
        })),
      }],
    }
  }, [domIntlData, total])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Domestic vs International</div>
          <div className="card-sub">Visitor type split</div>
        </div>
        <span className="badge badge-teal">Split</span>
      </div>
      <div className="card-body">
        <div ref={useEChart(option)} style={{ height: 260 }} />
      </div>
    </div>
  )
}
