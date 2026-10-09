/**
 * generate-dataset.mjs
 * Generates 1 000 realistic tourism records and writes:
 *   - src/data/tourismRecords.js   (ES module export)
 *   - public/tourism_dataset.csv   (portable flat file)
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

// __dirname = tourism-react/scripts/ → project root is one level up
const __dirname  = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '..')

// ── Reference tables ─────────────────────────────────────────────────────

const DESTINATIONS = [
  'Paris, France',      'Barcelona, Spain',   'New York, USA',
  'Rome, Italy',        'Tokyo, Japan',       'Dubai, UAE',
  'London, UK',         'Istanbul, Turkey',   'Amsterdam, Netherlands',
  'Bangkok, Thailand',  'Sydney, Australia',  'Singapore',
  'Prague, Czechia',    'Vienna, Austria',    'Bali, Indonesia',
  'Cancún, Mexico',     'Cairo, Egypt',       'Cape Town, South Africa',
  'Marrakech, Morocco', 'Mumbai, India',
]

const ORIGINS = [
  // International
  'China', 'United States', 'Germany', 'United Kingdom', 'France',
  'Russia', 'India', 'Japan', 'Canada', 'Australia',
  'Brazil', 'South Korea', 'Italy', 'Spain', 'Netherlands',
  'Saudi Arabia', 'Turkey', 'Mexico', 'Argentina', 'Sweden',
  // Domestic (tagged with destination country)
  'Île-de-France, France',   'Catalonia, Spain',       'New York State, USA',
  'Tuscany, Italy',          'Kantō, Japan',            'Dubai Emirate, UAE',
  'Greater London, UK',      'Istanbul Province, Turkey','Noord-Holland, NL',
  'Central Thailand',        'New South Wales, AU',     'Central Region, SG',
]

const AGE_GROUPS  = ['18–24','25–34','35–44','45–54','55–64','65+']
const GENDERS     = ['Male','Female','Non-binary']
const PURPOSES    = ['Leisure / Holiday','Business / MICE','Visiting Friends & Family','Health & Wellness','Education','Adventure','Transit']
const ACCOMM      = ['Hotel (5-star)','Hotel (4-star)','Hotel (3-star)','Hostel','Airbnb / Vacation Rental','Resort','Camping / Glamping','Friends / Family Home']
const SEASONS     = ['Spring','Summer','Autumn','Winter']
const VISITOR_TYPES = ['International','Domestic']

const SEASON_MONTHS = {
  Spring: [3,4,5],
  Summer: [6,7,8],
  Autumn: [9,10,11],
  Winter: [12,1,2],
}

// ── Weighted random helpers ───────────────────────────────────────────────

function rnd()            { return Math.random() }
function rndInt(a, b)     { return Math.floor(rnd() * (b - a + 1)) + a }
function pick(arr)        { return arr[Math.floor(rnd() * arr.length)] }

function weightedPick(arr, weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rnd() * total
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i]
    if (r <= 0) return arr[i]
  }
  return arr[arr.length - 1]
}

function padZero(n) { return String(n).padStart(2, '0') }

function randomDate(year) {
  const month = rndInt(1, 12)
  const day   = rndInt(1, 28)
  return `${year}-${padZero(month)}-${padZero(day)}`
}

function dateToSeason(dateStr) {
  const m = parseInt(dateStr.split('-')[1], 10)
  for (const [season, months] of Object.entries(SEASON_MONTHS)) {
    if (months.includes(m)) return season
  }
  return 'Unknown'
}

// ── Spending & stay model ────────────────────────────────────────────────
// Base spend per destination (USD/day) — roughly reflects real-world spread
const DEST_BASE_SPEND = {
  'Paris, France':             195, 'Barcelona, Spain':         165,
  'New York, USA':             310, 'Rome, Italy':              170,
  'Tokyo, Japan':              245, 'Dubai, UAE':               295,
  'London, UK':                285, 'Istanbul, Turkey':         130,
  'Amsterdam, Netherlands':    200, 'Bangkok, Thailand':        115,
  'Sydney, Australia':         230, 'Singapore':                275,
  'Prague, Czechia':           110, 'Vienna, Austria':          185,
  'Bali, Indonesia':            95, 'Cancún, Mexico':           145,
  'Cairo, Egypt':               85, 'Cape Town, South Africa':  120,
  'Marrakech, Morocco':         90, 'Mumbai, India':            105,
}

// Purpose multiplier on length of stay
const PURPOSE_STAY = {
  'Leisure / Holiday':        { minDays:3,  maxDays:14 },
  'Business / MICE':          { minDays:2,  maxDays:7  },
  'Visiting Friends & Family':{ minDays:4,  maxDays:21 },
  'Health & Wellness':        { minDays:5,  maxDays:14 },
  'Education':                { minDays:30, maxDays:180 },
  'Adventure':                { minDays:5,  maxDays:21 },
  'Transit':                  { minDays:1,  maxDays:2  },
}

// Accomm multiplier on daily spend
const ACCOMM_MULT = {
  'Hotel (5-star)':            1.8,
  'Hotel (4-star)':            1.3,
  'Hotel (3-star)':            1.0,
  'Hostel':                    0.55,
  'Airbnb / Vacation Rental':  0.85,
  'Resort':                    1.7,
  'Camping / Glamping':        0.45,
  'Friends / Family Home':     0.35,
}

// ── Record generator ─────────────────────────────────────────────────────

function generateRecord(id) {
  // Year biased toward 2024 (60%), 2023 (25%), 2022 (15%)
  const year = weightedPick([2024, 2023, 2022], [60, 25, 15])
  const dateOfVisit = randomDate(year)
  const season      = dateToSeason(dateOfVisit)
  const destination = pick(DESTINATIONS)
  const visitorType = weightedPick(VISITOR_TYPES, [65, 35])

  // Domestic visitors come from same country as destination
  let origin
  if (visitorType === 'Domestic') {
    const domOptions = ORIGINS.filter(o =>
      o.includes(destination.split(', ')[1] ?? 'X')
    )
    origin = domOptions.length > 0 ? pick(domOptions) : pick(ORIGINS.slice(20))
  } else {
    origin = pick(ORIGINS.slice(0, 20))
    // Avoid picking own country as international
  }

  const ageGroup   = weightedPick(AGE_GROUPS, [12, 26, 22, 19, 13, 8])
  const gender     = weightedPick(GENDERS,    [48, 49, 3])
  const purpose    = weightedPick(PURPOSES,   [44, 18, 14, 6, 5, 10, 3])
  const accomm     = weightedPick(ACCOMM,     [12, 22, 20, 8, 15, 10, 5, 8])
  const numVisitors= weightedPick([1,2,3,4,5,6],[22, 32, 18, 14, 8, 6])

  const stayRange  = PURPOSE_STAY[purpose]
  const lengthOfStay = rndInt(stayRange.minDays, stayRange.maxDays)

  const baseDailySpend = DEST_BASE_SPEND[destination] ?? 150
  const accommMult     = ACCOMM_MULT[accomm] ?? 1.0
  // Add ±20% noise
  const noise = 0.8 + rnd() * 0.4
  const avgDailySpend  = Math.round(baseDailySpend * accommMult * noise)
  // Total = daily × stay × group size (scaled down for groups)
  const totalSpend = Math.round(avgDailySpend * lengthOfStay * (1 + (numVisitors - 1) * 0.7))

  return {
    visitorId:       `TVA-${String(id).padStart(5, '0')}`,
    dateOfVisit,
    originLocation:  origin,
    destination,
    season,
    ageGroup,
    gender,
    visitorType,
    numberOfVisitors: numVisitors,
    lengthOfStay,
    travelPurpose:   purpose,
    avgDailySpend,
    totalSpend,
    accommodationType: accomm,
  }
}

// ── Generate 1 000 records ────────────────────────────────────────────────

const RECORDS = Array.from({ length: 1000 }, (_, i) => generateRecord(i + 1))

// ── Write JS module ───────────────────────────────────────────────────────

const jsContent = `// ── Auto-generated tourism dataset ───────────────────────────────────
// 1 000 realistic synthetic records · 13 fields per record
// Run scripts/generate-dataset.mjs to regenerate.

/**
 * @typedef {Object} TourismRecord
 * @property {string} visitorId          - Unique visitor identifier (TVA-00001 …)
 * @property {string} dateOfVisit        - ISO date string (YYYY-MM-DD)
 * @property {string} originLocation     - Country or state of origin
 * @property {string} destination        - City and country visited
 * @property {string} season             - Spring | Summer | Autumn | Winter
 * @property {string} ageGroup           - Age bracket (18–24, 25–34, …)
 * @property {string} gender             - Male | Female | Non-binary
 * @property {string} visitorType        - International | Domestic
 * @property {number} numberOfVisitors   - Party size
 * @property {number} lengthOfStay       - Days spent at destination
 * @property {string} travelPurpose      - Reason for travel
 * @property {number} avgDailySpend      - Average spend per day (USD)
 * @property {number} totalSpend         - Total trip spend (USD)
 * @property {string} accommodationType  - Type of accommodation used
 */

/** @type {TourismRecord[]} */
export const TOURISM_RECORDS = ${JSON.stringify(RECORDS, null, 2)}
`

const srcDataDir = join(PROJECT_ROOT, 'src', 'data')
mkdirSync(srcDataDir, { recursive: true })
writeFileSync(join(srcDataDir, 'tourismRecords.js'), jsContent, 'utf8')
console.log('✓ src/data/tourismRecords.js written')

// ── Write CSV ─────────────────────────────────────────────────────────────

const CSV_HEADERS = [
  'Visitor ID','Date of Visit','Country/State of Origin','Destination',
  'Season','Age Group','Gender','Visitor Type',
  'Number of Visitors','Length of Stay (days)',
  'Travel Purpose','Average Daily Spend (USD)','Total Spend (USD)',
  'Accommodation Type',
]

function csvEscape(val) {
  const s = String(val)
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"` : s
}

const csvRows = [
  CSV_HEADERS.join(','),
  ...RECORDS.map(r => [
    r.visitorId, r.dateOfVisit, r.originLocation, r.destination,
    r.season, r.ageGroup, r.gender, r.visitorType,
    r.numberOfVisitors, r.lengthOfStay,
    r.travelPurpose, r.avgDailySpend, r.totalSpend,
    r.accommodationType,
  ].map(csvEscape).join(',')),
]

const publicDir = join(PROJECT_ROOT, 'public')
mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, 'tourism_dataset.csv'), csvRows.join('\n'), 'utf8')
console.log('✓ public/tourism_dataset.csv written')
console.log(`  → ${RECORDS.length} records generated`)
