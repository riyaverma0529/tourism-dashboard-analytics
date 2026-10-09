import { useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'

const BAR_COLOR = { type:'linear', x:0, y:0, x2:1, y2:0,
  colorStops:[{offset:0,color:'#1e6fb5'},{offset:1,color:'#38bdf8'}] }

export default function DestinationsBarChart({ chartData }) {
  const { topDests = [] } = chartData ?? {}

  const option = useMemo(() => {
    if (!topDests.length) return {}
    const labels = topDests.map(d => d.dest)
    const values = topDests.map(d => d.count)
    const max    = values[0] ?? 1
    return {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: p => `<b>${topDests[p[0].dataIndex]?.fullDest}</b><br/>
          Visitors: <b>${p[0].value.toLocaleString()}</b>`,
      },
      grid: { left: 10, right: 60, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: '#5a6a7a', formatter: v => v.toLocaleString() },
        splitLine: { lineStyle: { color: '#f0f4f8', type: 'dashed' } },
        axisLine: { show: false }, axisTick: { show: false },
      },
      yAxis: {
        type: 'category', data: [...labels].reverse(),
        axisLabel: { fontSize: 11, color: '#1a2332' },
        axisLine: { lineStyle: { color: '#dde3ea' } },
        axisTick: { show: false },
      },
      series: [{
        type: 'bar', barMaxWidth: 20,
        data: [...values].reverse().map((v, i) => ({
          value: v,
          itemStyle: {
            color: BAR_COLOR,
            opacity: 0.45 + 0.55 * (v / max),
            borderRadius: [0, 6, 6, 0],
          },
        })),
        label: {
          show: true, position: 'right',
          formatter: p => p.value.toLocaleString(),
          fontSize: 10, fontWeight: 700, color: '#1a2332',
        },
        emphasis: { itemStyle: { opacity: 1, shadowBlur: 8, shadowColor: 'rgba(30,111,181,0.3)' } },
      }],
    }
  }, [topDests])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Visitors by Destination</div>
          <div className="card-sub">Total visitor headcount — top destinations</div>
        </div>
        <span className="badge badge-teal">Top 12</span>
      </div>
      <div className="card-body">
        <div ref={useEChart(option)} style={{ height: 340 }} />
      </div>
    </div>
  )
}
