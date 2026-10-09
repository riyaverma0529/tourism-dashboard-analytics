import { useEChart } from '../hooks/useEChart'
import { REGION_REVENUE } from '../data/tourismData'

function buildOption() {
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 10, right: 10, top: 32, bottom: 20, containLabel: true },
    xAxis: {
      type: 'category',
      data: REGION_REVENUE.labels,
      axisLabel: { fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: v => '$' + v + 'B', fontSize: 10 },
      splitLine: { lineStyle: { color: '#f0f4f8' } },
    },
    series: REGION_REVENUE.regions.map((reg, i) => ({
      name: reg,
      type: 'bar',
      stack: 'total',
      barMaxWidth: 48,
      data: REGION_REVENUE.data[i],
      itemStyle: { color: REGION_REVENUE.colors[i] },
      // Show total label on the last stacked segment
      label:
        i === REGION_REVENUE.regions.length - 1
          ? {
              show: true,
              position: 'top',
              formatter: p => {
                const total = REGION_REVENUE.data.reduce(
                  (s, arr) => s + arr[p.dataIndex],
                  0
                )
                return '$' + total + 'B'
              },
              fontSize: 11,
              fontWeight: 700,
            }
          : undefined,
    })),
  }
}

export default function RegionRevenueChart() {
  const ref = useEChart(buildOption())

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Revenue by Region</div>
          <div className="card-sub">USD billions — Q1–Q4 2024</div>
        </div>
      </div>
      <div className="card-body">
        <div ref={ref} style={{ height: 280 }} />
      </div>
    </div>
  )
}
