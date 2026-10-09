import { HEATMAP_REGIONS, HEATMAP_OCCUPANCY } from '../data/tourismData'

const MONTH_ABBR = ['J','F','M','A','M','J','J','A','S','O','N','D']
const LEGEND = [
  { cls: 'heat-0', label: '<50%'  },
  { cls: 'heat-1', label: '50–65%' },
  { cls: 'heat-2', label: '65–80%' },
  { cls: 'heat-3', label: '80–90%' },
  { cls: 'heat-4', label: '>90%'  },
]

function heatClass(v) {
  if (v < 50) return 'heat-0'
  if (v < 65) return 'heat-1'
  if (v < 80) return 'heat-2'
  if (v < 90) return 'heat-3'
  return 'heat-4'
}

export default function OccupancyHeatmap() {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Monthly Occupancy Heatmap</div>
          <div className="card-sub">Region × Month — average occupancy %</div>
        </div>
        <span className="badge badge-amber">2024</span>
      </div>
      <div className="card-body">
        <div className="heatmap-wrap">
          <table className="heatmap-table">
            <thead>
              <tr>
                <th />
                {MONTH_ABBR.map((m, i) => <th key={i}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_REGIONS.map((region, ri) => (
                <tr key={region}>
                  <td className="row-label">{region}</td>
                  {HEATMAP_OCCUPANCY[ri].map((v, ci) => (
                    <td key={ci} className={heatClass(v)}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="heatmap-legend">
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
            Occupancy:
          </span>
          {LEGEND.map(l => (
            <span key={l.cls} className={`heatmap-legend-item ${l.cls}`}>{l.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
