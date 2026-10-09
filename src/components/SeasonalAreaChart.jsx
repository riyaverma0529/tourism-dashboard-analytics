import { useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'

const INTL_COLOR = '#1e6fb5'
const DOM_COLOR  = '#0d9488'
const SEASON_ICONS = { Spring:'🌸', Summer:'☀️', Autumn:'🍂', Winter:'❄️' }

export default function SeasonalAreaChart({ chartData }) {
  const { seasonalData = [] } = chartData ?? {}

  const option = useMemo(() => {
    if (!seasonalData.length) return {}
    const labels = seasonalData.map(d => `${SEASON_ICONS[d.season] ?? ''} ${d.season}`)
    return {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: params => {
          const d = seasonalData[params[0].dataIndex]
          const total = d.international + d.domestic
          return `<b>${d.season}</b><br/>
            <span style="color:${INTL_COLOR}">● International:</span> <b>${d.international.toLocaleString()}</b><br/>
            <span style="color:${DOM_COLOR}">● Domestic:</span> <b>${d.domestic.toLocaleString()}</b><br/>
            <span style="color:#5a6a7a">Total:</span> <b>${total.toLocaleString()}</b>`
        },
      },
      legend: {
        top: 4, right: 0, textStyle: { fontSize: 11, color: '#5a6a7a' }, icon: 'roundRect',
      },
      grid: { left: 10, right: 16, top: 36, bottom: 8, containLabel: true },
      xAxis: {
        type: 'category', data: labels,
        axisLine: { lineStyle: { color: '#dde3ea' } },
        axisTick: { show: false }, axisLabel: { fontSize: 12, color: '#1a2332' },
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: '#5a6a7a', formatter: v => v.toLocaleString() },
        splitLine: { lineStyle: { color: '#f0f4f8', type: 'dashed' } },
        axisLine: { show: false }, axisTick: { show: false },
      },
      series: [
        {
          name: 'International',
          type: 'line', stack: 'total',
          data: seasonalData.map(d => d.international),
          smooth: 0.5,
          lineStyle: { width: 2, color: INTL_COLOR },
          itemStyle: { color: INTL_COLOR },
          areaStyle: { color: { type:'linear', x:0, y:0, x2:0, y2:1,
            colorStops:[{offset:0,color:'rgba(30,111,181,0.55)'},{offset:1,color:'rgba(30,111,181,0.05)'}] }},
          label: { show: true, position: 'top', fontSize: 10, fontWeight: 700, color: '#1e6fb5',
            formatter: p => p.value.toLocaleString() },
          emphasis: { focus: 'series' },
          symbolSize: 8,
        },
        {
          name: 'Domestic',
          type: 'line', stack: 'total',
          data: seasonalData.map(d => d.domestic),
          smooth: 0.5,
          lineStyle: { width: 2, color: DOM_COLOR },
          itemStyle: { color: DOM_COLOR },
          areaStyle: { color: { type:'linear', x:0, y:0, x2:0, y2:1,
            colorStops:[{offset:0,color:'rgba(13,148,136,0.55)'},{offset:1,color:'rgba(13,148,136,0.05)'}] }},
          label: { show: true, position: 'top', fontSize: 10, fontWeight: 700, color: '#0d9488',
            formatter: p => p.value.toLocaleString() },
          emphasis: { focus: 'series' },
          symbolSize: 8,
        },
      ],
    }
  }, [seasonalData])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Visitors by Season</div>
          <div className="card-sub">Stacked area — International vs Domestic per season</div>
        </div>
        <span className="badge badge-amber">Seasonal</span>
      </div>
      <div className="card-body">
        <div ref={useEChart(option)} style={{ height: 280 }} />
      </div>
    </div>
  )
}
