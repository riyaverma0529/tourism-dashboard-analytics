import { useEChart } from '../hooks/useEChart'
import { RADAR_DATA } from '../data/tourismData'

const OPTION = {
  tooltip: {},
  legend: { bottom: 0, textStyle: { fontSize: 11 } },
  radar: {
    indicator: RADAR_DATA.indicators,
    radius: '62%',
    splitLine: { lineStyle: { color: '#e5e7eb' } },
    axisName: { fontSize: 11, color: '#5a6a7a' },
  },
  series: [
    {
      type: 'radar',
      data: RADAR_DATA.series.map(s => ({
        name: s.name,
        value: s.value,
        lineStyle: { color: s.color },
        areaStyle: { color: s.color + '26' },
        itemStyle: { color: s.color },
      })),
    },
  ],
}

export default function RadarChart() {
  const ref = useEChart(OPTION)

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Destination Profile</div>
          <div className="card-sub">Multi-metric destination radar</div>
        </div>
      </div>
      <div className="card-body">
        <div ref={ref} style={{ height: 260 }} />
      </div>
    </div>
  )
}
