import { useMemo } from 'react'
import { useEChart } from '../hooks/useEChart'
import { PURPOSE_DATA } from '../data/tourismData'

const OPTION = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}% ({d}%)' },
  legend: { bottom: 0, textStyle: { fontSize: 11 } },
  series: [
    {
      type: 'pie',
      radius: ['42%', '70%'],
      center: ['50%', '44%'],
      label: { formatter: '{b}\n{c}%', fontSize: 11, fontWeight: 600 },
      data: PURPOSE_DATA.map(d => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: d.color },
      })),
    },
  ],
}

export default function PurposeChart() {
  const ref = useEChart(OPTION)

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Visitor Purpose</div>
          <div className="card-sub">Breakdown by travel type</div>
        </div>
      </div>
      <div className="card-body">
        <div ref={ref} style={{ height: 280 }} />
      </div>
    </div>
  )
}
