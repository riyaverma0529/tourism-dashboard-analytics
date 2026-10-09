import { useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'
import { MONTHS_ORDERED } from '../data/dataUtils.js'

const PALETTE = ['#b0c8e8', '#6aaddf', '#1e6fb5']
const AREA_GRAD = color => ({
  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
  colorStops: [
    { offset: 0, color: color + '30' },
    { offset: 1, color: color + '00' },
  ],
})

export default function ArrivalsChart({ chartData }) {
  const { monthlyArrivals = [] } = chartData ?? {}

  const option = useMemo(() => {
    if (!monthlyArrivals.length) return {}
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', crossStyle: { color: '#aaa' } },
        formatter: params => {
          const hdr = `<b>${MONTHS_ORDERED[params[0].dataIndex]}</b><br/>`
          return hdr + params.map(p =>
            `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:5px"></span>
             ${p.seriesName}: <b>${p.value?.toLocaleString()}</b>`
          ).join('<br/>')
        },
      },
      legend: {
        top: 4, right: 0,
        textStyle: { fontSize: 11, color: '#5a6a7a' },
        icon: 'roundRect',
      },
      grid: { left: 10, right: 16, top: 36, bottom: 0, containLabel: true },
      xAxis: {
        type: 'category',
        data: MONTHS_ORDERED,
        axisLine: { lineStyle: { color: '#dde3ea' } },
        axisTick: { show: false },
        axisLabel: { fontSize: 11, color: '#5a6a7a' },
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: '#5a6a7a', formatter: v => v.toLocaleString() },
        splitLine: { lineStyle: { color: '#f0f4f8', type: 'dashed' } },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: monthlyArrivals.map((s, i) => {
        const color = PALETTE[i] ?? '#1e6fb5'
        const isLatest = i === monthlyArrivals.length - 1
        return {
          name: s.year,
          type: 'line',
          data: s.data,
          smooth: 0.4,
          symbol: 'circle',
          symbolSize: isLatest ? 6 : 0,
          showSymbol: false,
          emphasis: { focus: 'series', scale: true },
          lineStyle: { width: isLatest ? 3 : 2, color },
          itemStyle: { color },
          areaStyle: isLatest ? { color: AREA_GRAD(color) } : undefined,
          markPoint: isLatest ? {
            data: [{ type: 'max', name: 'Peak' }],
            symbol: 'pin',
            symbolSize: 32,
            label: { fontSize: 10, color: '#fff', fontWeight: 700 },
            itemStyle: { color: '#1e6fb5' },
          } : undefined,
        }
      }),
    }
  }, [monthlyArrivals])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Tourism Arrivals by Month / Year</div>
          <div className="card-sub">Visitor headcount — monthly breakdown per year</div>
        </div>
        <span className="badge badge-blue">Live Data</span>
      </div>
      <div className="card-body">
        <div ref={useEChart(option)} style={{ height: 300 }} />
      </div>
    </div>
  )
}
