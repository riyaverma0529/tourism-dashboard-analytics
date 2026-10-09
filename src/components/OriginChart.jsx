import { useEChart } from '../hooks/useEChart'
import { ORIGIN_DATA } from '../data/tourismData'

const OPTION = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 100, right: 50, top: 10, bottom: 20, containLabel: false },
  xAxis: {
    type: 'value',
    max: 35,
    axisLabel: { formatter: v => v + '%', fontSize: 10 },
    splitLine: { lineStyle: { color: '#f0f4f8' } },
  },
  yAxis: {
    type: 'category',
    data: ORIGIN_DATA.map(d => d.country),
    axisLabel: { fontSize: 11 },
  },
  series: [
    {
      type: 'bar',
      barMaxWidth: 20,
      data: ORIGIN_DATA.map(d => ({
        value: d.pct,
        itemStyle: { color: d.color, borderRadius: [0, 4, 4, 0] },
      })),
      label: {
        show: true,
        position: 'right',
        formatter: p => p.value + '%',
        fontSize: 10,
        fontWeight: 600,
      },
    },
  ],
}

export default function OriginChart() {
  const ref = useEChart(OPTION)

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Visitor Origin</div>
          <div className="card-sub">Top source markets by outbound share</div>
        </div>
      </div>
      <div className="card-body">
        <div ref={ref} style={{ height: 300 }} />
      </div>
    </div>
  )
}
