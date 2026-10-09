import { DESTINATIONS } from '../data/tourismData'

const RANK_CLASS = { 1: 'gold', 2: 'silver', 3: 'bronze' }

export default function DestinationsTable() {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Destination Rankings</div>
          <div className="card-sub">Sorted by total international arrivals</div>
        </div>
      </div>
      <div className="card-body" style={{ paddingTop: 12 }}>
        <table className="dest-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Destination</th>
              <th>Arrivals</th>
              <th>Revenue</th>
              <th>Share</th>
              <th>YoY</th>
            </tr>
          </thead>
          <tbody>
            {DESTINATIONS.map(d => (
              <tr key={d.name}>
                <td>
                  <span className={`rank-badge ${RANK_CLASS[d.rank] ?? ''}`}>{d.rank}</span>
                </td>
                <td>
                  <div className="dest-name">
                    <span className="dest-flag">{d.flag}</span>
                    <div className="dest-info">
                      <strong>{d.name}</strong>
                      <span>{d.region}</span>
                    </div>
                  </div>
                </td>
                <td>{d.arrivals}</td>
                <td>{d.revenue}</td>
                <td>
                  <div className="bar-cell">
                    <div className="mini-bar-wrap">
                      <div className="mini-bar" style={{ width: `${d.pct}%` }} />
                    </div>
                    <span>{d.share}%</span>
                  </div>
                </td>
                <td className={d.yoy >= 0 ? 'trend-up' : 'trend-down'}>
                  {d.yoy >= 0 ? '▲' : '▼'} {Math.abs(d.yoy)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
