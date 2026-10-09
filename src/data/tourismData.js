// ── Tourism & Visitor Analytics — Data Layer ──────────────────────────

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export const Q_LABELS = ['Q1 2024','Q2 2024','Q3 2024','Q4 2024']

// ── KPI data by year ────────────────────────────────────────────────────
export const KPI_BY_YEAR = {
  '2025': {
    arrivals:     { value: '0.74B',  delta: '+6.2%', dir: 'up',   note: 'vs prior year' },
    revenue:      { value: '$0.98T', delta: '+9.8%',  dir: 'up',   note: 'vs prior year' },
    stay:         { value: '7.5',    unit: 'days', delta: '+0.2 days', dir: 'up',  note: 'vs prior year' },
    satisfaction: { value: '4.7',    unit: '/5',   delta: '+0.1 pts',  dir: 'up',  note: 'vs prior year' },
    domestic:     '2.1B',
    international:'0.74B',
    totalVisitors:'2.84B',
  },
  '2024': {
    arrivals:     { value: '1.42B',  delta: '+8.4%',  dir: 'up',   note: 'vs prior year' },
    revenue:      { value: '$1.87T', delta: '+12.1%', dir: 'up',   note: 'vs prior year' },
    stay:         { value: '7.3',    unit: 'days', delta: '+0.3 days', dir: 'flat', note: 'vs prior year' },
    satisfaction: { value: '4.6',    unit: '/5',   delta: '+0.2 pts',  dir: 'up',  note: 'vs prior year' },
    domestic:     '3.8B',
    international:'1.42B',
    totalVisitors:'5.22B',
  },
  '2023': {
    arrivals:     { value: '1.34B',  delta: '+15.2%', dir: 'up',   note: 'vs prior year' },
    revenue:      { value: '$1.67T', delta: '+28.4%', dir: 'up',   note: 'vs prior year' },
    stay:         { value: '7.0',    unit: 'days', delta: '+0.4 days', dir: 'up',  note: 'vs prior year' },
    satisfaction: { value: '4.4',    unit: '/5',   delta: '+0.3 pts',  dir: 'up',  note: 'vs prior year' },
    domestic:     '3.5B',
    international:'1.34B',
    totalVisitors:'4.84B',
  },
  '2022': {
    arrivals:     { value: '1.16B',  delta: '+108%',  dir: 'up',   note: 'vs prior year' },
    revenue:      { value: '$1.30T', delta: '+50.2%', dir: 'up',   note: 'vs prior year' },
    stay:         { value: '6.8',    unit: 'days', delta: '-0.2 days', dir: 'down', note: 'vs prior year' },
    satisfaction: { value: '4.2',    unit: '/5',   delta: '-0.1 pts',  dir: 'down', note: 'vs prior year' },
    domestic:     '3.0B',
    international:'1.16B',
    totalVisitors:'4.16B',
  },
}

// ── Arrivals line/bar data ───────────────────────────────────────────────
export const ARRIVALS_DATA = {
  monthly: {
    labels: MONTHS,
    series: [
      { name: '2022', data: [88,72,95,108,115,130,162,158,142,118,95,80] },
      { name: '2023', data: [95,80,110,122,130,148,182,178,160,132,108,92] },
      { name: '2024', data: [105,92,124,138,148,168,198,195,175,145,120,105] },
    ],
  },
  quarterly: {
    labels: Q_LABELS,
    series: [
      { name: '2022', data: [255, 353, 462, 293] },
      { name: '2023', data: [285, 400, 520, 332] },
      { name: '2024', data: [321, 454, 568, 370] },
    ],
  },
  annual: {
    labels: ['2019','2020','2021','2022','2023','2024'],
    series: [
      { name: 'Arrivals (M)', data: [1462, 407, 558, 1163, 1337, 1513] },
    ],
  },
}

// ── Top destinations ─────────────────────────────────────────────────────
export const DESTINATIONS = [
  { rank:1, flag:'🇫🇷', name:'France',        region:'Europe',       arrivals:'94.2M', revenue:'$67.4B',  share:6.6, yoy:+5.3,  pct:100 },
  { rank:2, flag:'🇪🇸', name:'Spain',         region:'Europe',       arrivals:'85.1M', revenue:'$83.7B',  share:6.0, yoy:+7.8,  pct:90  },
  { rank:3, flag:'🇺🇸', name:'United States', region:'Americas',     arrivals:'79.3M', revenue:'$181.0B', share:5.6, yoy:+9.1,  pct:84  },
  { rank:4, flag:'🇨🇳', name:'China',         region:'Asia-Pacific', arrivals:'66.0M', revenue:'$49.5B',  share:4.6, yoy:+14.2, pct:70  },
  { rank:5, flag:'🇮🇹', name:'Italy',         region:'Europe',       arrivals:'64.5M', revenue:'$51.8B',  share:4.5, yoy:+6.5,  pct:68  },
  { rank:6, flag:'🇹🇷', name:'Turkey',        region:'Europe/Asia',  arrivals:'60.2M', revenue:'$40.1B',  share:4.2, yoy:+11.3, pct:64  },
  { rank:7, flag:'🇲🇽', name:'Mexico',        region:'Americas',     arrivals:'42.1M', revenue:'$26.4B',  share:3.0, yoy:+4.2,  pct:45  },
  { rank:8, flag:'🇩🇪', name:'Germany',       region:'Europe',       arrivals:'38.6M', revenue:'$38.9B',  share:2.7, yoy:+3.1,  pct:41  },
]

// ── Visitor origin (outbound share) ──────────────────────────────────────
export const ORIGIN_DATA = [
  { country: 'China',         pct: 14.2, color: '#1e6fb5' },
  { country: 'United States', pct: 11.8, color: '#0d9488' },
  { country: 'Germany',       pct:  8.4, color: '#d97706' },
  { country: 'United Kingdom',pct:  7.6, color: '#7c3aed' },
  { country: 'France',        pct:  6.9, color: '#e11d48' },
  { country: 'Russia',        pct:  5.8, color: '#059669' },
  { country: 'India',         pct:  5.2, color: '#f59e0b' },
  { country: 'Japan',         pct:  4.7, color: '#6366f1' },
  { country: 'Canada',        pct:  3.8, color: '#14b8a6' },
  { country: 'Others',        pct: 31.6, color: '#e5e7eb' },
]

// ── Occupancy heatmap ─────────────────────────────────────────────────────
export const HEATMAP_REGIONS = ['Europe','Asia-Pac','Americas','Mid East','Africa']
export const HEATMAP_OCCUPANCY = [
  [46, 49, 58, 64, 72, 88, 94, 96, 87, 70, 55, 48],
  [52, 55, 61, 70, 78, 84, 91, 93, 82, 68, 58, 53],
  [44, 47, 55, 62, 69, 82, 90, 92, 80, 65, 50, 45],
  [68, 70, 75, 80, 85, 91, 94, 96, 89, 82, 74, 70],
  [38, 41, 50, 57, 63, 74, 82, 85, 75, 60, 46, 40],
]

// ── Regional revenue by quarter ───────────────────────────────────────────
export const REGION_REVENUE = {
  labels:  Q_LABELS,
  regions: ['Europe','Asia-Pacific','Americas','Mid East & Africa'],
  colors:  ['#1e6fb5','#0d9488','#d97706','#7c3aed'],
  data: [
    [118, 145, 195, 130],
    [92,  118, 155, 108],
    [85,  110, 142,  98],
    [38,   48,  62,  45],
  ],
}

// ── Age demographics ─────────────────────────────────────────────────────
export const DEMOGRAPHICS_DATA = [
  { name: '18–24', value: 12 },
  { name: '25–34', value: 24 },
  { name: '35–44', value: 21 },
  { name: '45–54', value: 18 },
  { name: '55–64', value: 15 },
  { name: '65+',   value: 10 },
]

// ── Satisfaction ──────────────────────────────────────────────────────────
export const SATISFACTION = {
  overall: 4.6,
  label:   'Excellent',
  categories: [
    { name: 'Accommodation',   score: 4.6, pct: 92 },
    { name: 'Transportation',  score: 4.3, pct: 86 },
    { name: 'Safety & Security', score: 4.5, pct: 90 },
    { name: 'Local Experience', score: 4.8, pct: 96 },
    { name: 'Value for Money', score: 4.1, pct: 82 },
  ],
}

// ── Visitor purpose (donut) ───────────────────────────────────────────────
export const PURPOSE_DATA = [
  { name: 'Leisure / Holiday', value: 58, color: '#1e6fb5' },
  { name: 'Business / MICE',   value: 21, color: '#0d9488' },
  { name: 'Visiting Friends',  value: 13, color: '#d97706' },
  { name: 'Health & Wellness', value:  5, color: '#7c3aed' },
  { name: 'Transit',           value:  3, color: '#e5e7eb' },
]

// ── Destination profile radar ─────────────────────────────────────────────
export const RADAR_DATA = {
  indicators: [
    { name: 'Beaches',       max: 100 },
    { name: 'Culture',       max: 100 },
    { name: 'Gastronomy',    max: 100 },
    { name: 'Adventure',     max: 100 },
    { name: 'Nightlife',     max: 100 },
    { name: 'Affordability', max: 100 },
  ],
  series: [
    { name: 'Mediterranean', value: [88,92,95,65,80,55], color: '#1e6fb5' },
    { name: 'SE Asia',        value: [95,70,85,92,78,82], color: '#0d9488' },
    { name: 'Middle East',    value: [60,95,80,55,85,48], color: '#d97706' },
  ],
}

// ── Average daily spend ───────────────────────────────────────────────────
export const SPEND_DATA = {
  labels: ['Monaco','Switzerland','USA','UAE','Singapore','Japan','Australia','France','Germany','Spain'],
  values: [412, 386, 312, 298, 275, 248, 235, 198, 182, 165],
}

// ── Arrivals vs Revenue growth scatter ────────────────────────────────────
export const SCATTER_DATA = [
  { name: 'France',   x:  5.3, y:  6.1, size: 94 },
  { name: 'Spain',    x:  7.8, y:  9.2, size: 85 },
  { name: 'USA',      x:  9.1, y: 10.8, size: 79 },
  { name: 'China',    x: 14.2, y: 12.4, size: 66 },
  { name: 'Italy',    x:  6.5, y:  7.3, size: 64 },
  { name: 'Turkey',   x: 11.3, y: 13.1, size: 60 },
  { name: 'Mexico',   x:  4.2, y:  5.8, size: 42 },
  { name: 'Germany',  x:  3.1, y:  4.2, size: 38 },
  { name: 'Thailand', x: 18.4, y: 15.6, size: 35 },
  { name: 'UAE',      x: 16.2, y: 14.8, size: 28 },
]
