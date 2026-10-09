import { SATISFACTION } from '../data/tourismData'

export default function SatisfactionCard() {
  const { overall, label, categories } = SATISFACTION

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Satisfaction Score</div>
          <div className="card-sub">2024 annual rating — 5 000+ reviews</div>
        </div>
      </div>
      <div className="card-body">
        {/* SVG arc gauge */}
        <div className="gauge-wrap">
          <svg className="gauge-svg" viewBox="0 0 180 100">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#0d9488" />
                <stop offset="100%" stopColor="#1e6fb5" />
              </linearGradient>
            </defs>
            {/* track */}
            <path
              d="M10,90 A80,80 0 0,1 170,90"
              fill="none" stroke="#e5e7eb" strokeWidth="14" strokeLinecap="round"
            />
            {/* fill — dashoffset = 251 * (1 - score/5) */}
            <path
              d="M10,90 A80,80 0 0,1 170,90"
              fill="none" stroke="url(#gaugeGrad)" strokeWidth="14" strokeLinecap="round"
              strokeDasharray="251"
              strokeDashoffset={Math.round(251 * (1 - overall / 5))}
            />
          </svg>
          <div className="gauge-score">{overall}</div>
          <div className="gauge-label">out of 5.0 · {label}</div>
        </div>

        {/* Score breakdown */}
        <div className="score-breakdown">
          {categories.map(c => (
            <div key={c.name} className="score-row">
              <span className="score-cat">{c.name}</span>
              <div className="score-bar-wrap">
                <div className="score-bar" style={{ width: `${c.pct}%` }} />
              </div>
              <span className="score-val">{c.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
