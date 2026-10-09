import { useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'

export default function StayByDestChart({ chartData }) {
  const { stayByDest = [] } = chartData ?? {}
  const maxVal = stayByDest.reduce((m, d) => Math.max(m, d.avg), 0) || 1

  const option = useMemo(() => {
    if (!stayByDest.length) return {}
    const sorted = [...stayByDest].sort((a, b) => a.avg - b.avg)
    const avgAll = sorted.length
      ? +(sorted.reduce((s, d) => s + d.avg, 0) / sorted.length).toFixed(1)
      : 0

    return {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: p => `<b>${sorted[p[0].dataIndex]?.fullDest ?? p[0].name}</b><br/>
          Avg Stay: <b>${p[0].value} nights</b>`,
      },
      grid: { left: 10, right: 60, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: '#5a6a7a', formatter: v => v + 'd' },
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
        data: sorted.map((d, i) => ({
          value: d.avg,
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [{ offset: 0, color: '#7c3aed' }, { offset: 1, color: '#a78bfa' }],
            },
            borderRadius: [0, 6, 6, 0],
            opacity: 0.45 + 0.55 * (d.avg / maxVal),
          },
        })),
        label: {
          show: true, position: 'right',
          formatter: p => `${p.value}d`,
          fontSize: 10, fontWeight: 700, color: '#1a2332',
        },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.2)' } },
        markLine: {
          silent: true,
          data: [{ xAxis: avgAll, name: 'Avg' }],
          lineStyle: { color: '#d97706', type: 'dashed', width: 1.5 },
          label: { formatter: `Avg ${avgAll}d`, fontSize: 10, color: '#d97706', fontWeight: 700 },
        },
      }],
    }
  }, [stayByDest, maxVal])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Avg. Length of Stay by Destination</div>
          <div className="card-sub">Mean nights per trip — filtered data</div>
        </div>
        <span className="badge badge-blue">Stay</span>
      </div>
      <div className="card-body">
        <div ref={useEChart(option)} style={{ height: 320 }} />
      </div>
    </div>
  )
}
