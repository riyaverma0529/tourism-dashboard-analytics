import { useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'

const maxSpend = arr => arr.reduce((m, d) => Math.max(m, d.avg), 0)

export default function SpendChart({ chartData }) {
  const { spendByDest = [] } = chartData ?? {}
  const maxVal = maxSpend(spendByDest) || 1

  const option = useMemo(() => {
    if (!spendByDest.length) return {}
    const sorted = [...spendByDest].sort((a, b) => a.avg - b.avg)
    return {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: p => `<b>${sorted[p[0].dataIndex]?.fullDest ?? p[0].name}</b><br/>
          Avg Daily Spend: <b>$${p[0].value}/day</b>`,
      },
      grid: { left: 10, right: 65, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: '#5a6a7a', formatter: v => '$' + v },
        splitLine: { lineStyle: { color: '#f0f4f8', type: 'dashed' } },
        axisLine: { show: false }, axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: sorted.map(d => d.dest),
        axisLabel: { fontSize: 11, color: '#1a2332' },
        axisLine: { lineStyle: { color: '#dde3ea' } }, axisTick: { show: false },
      },
      series: [{
        type: 'bar', barMaxWidth: 20,
        data: sorted.map(d => ({
          value: d.avg,
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [{ offset: 0, color: '#1e6fb5' }, { offset: 1, color: '#0d9488' }],
            },
            borderRadius: [0, 6, 6, 0],
            opacity: 0.5 + 0.5 * (d.avg / maxVal),
          },
        })),
        label: {
          show: true, position: 'right',
          formatter: p => `$${p.value}/day`,
          fontSize: 10, fontWeight: 700, color: '#1a2332',
        },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.2)' } },
        markLine: {
          silent: true,
          data: [{ type: 'average', name: 'Avg' }],
          lineStyle: { color: '#d97706', type: 'dashed', width: 1.5 },
          label: { formatter: 'Avg: ${c}', fontSize: 10, color: '#d97706', fontWeight: 700 },
        },
      }],
    }
  }, [spendByDest, maxVal])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Average Spending by Destination</div>
          <div className="card-sub">Mean daily spend per visitor (USD) — filtered data</div>
        </div>
        <span className="badge badge-green">Spend</span>
      </div>
      <div className="card-body">
        <div ref={useEChart(option)} style={{ height: 320 }} />
      </div>
    </div>
  )
}
