import { useEChart } from '../hooks/useEChart'
import { SCATTER_DATA } from '../data/tourismData'

const OPTION = {
  tooltip: {
    trigger: 'item',
    formatter: p =>
      `<b>${p.data.name}</b><br/>Arrival growth: ${p.data.value[0]}%<br/>Revenue growth: ${p.data.value[1]}%`,
  },
  grid: { left: 40, right: 20, top: 20, bottom: 30, containLabel: true },
  xAxis: {
    name: 'Arrival Growth (%)',
    type: 'value',
    min: 0, max: 20,
    axisLabel: { fontSize: 10 },
    splitLine: { lineStyle: { color: '#f0f4f8' } },
  },
  yAxis: {
    name: 'Revenue Growth (%)',
    type: 'value',
    min: 0, max: 18,
    axisLabel: { fontSize: 10 },
    splitLine: { lineStyle: { color: '#f0f4f8' } },
  },
  series: [
    {
      type: 'scatter',
      data: SCATTER_DATA.map(d => ({
        name: d.name,
        value: [d.x, d.y],
        symbolSize: Math.max(12, d.size / 3.5),
      })),
      itemStyle: { color: '#1e6fb5', opacity: 0.72 },
      label: {
        show: true,
        position: 'top',
        formatter: p => p.data.name,
        fontSize: 10,
        fontWeight: 600,
        color: '#1a2332',
      },
    },
  ],
}

export default function ScatterChart() {
  const ref = useEChart(OPTION)

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Arrivals vs. Revenue Growth</div>
          <div className="card-sub">Bubble size = market size — 2024</div>
        </div>
      </div>
      <div className="card-body">
        <div ref={ref} style={{ height: 260 }} />
      </div>
    </div>
  )
}
