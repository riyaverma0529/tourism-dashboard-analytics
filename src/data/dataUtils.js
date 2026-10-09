/**
 * dataUtils.js  —  v2
 * Aggregation helpers. applyFilters() now supports all 9 filter dimensions.
 * computeFilteredChartData() derives every chart dataset from a filtered slice.
 */

import { TOURISM_RECORDS } from './tourismRecords.js'

// ── Lookup tables ─────────────────────────────────────────────────────────

const REGION_DEST_FRAGMENTS = {
  europe:   ['France','Spain','Italy','Turkey','UK','Netherlands','Czechia','Austria','Morocco'],
  asia:     ['Japan','Thailand','Indonesia','Singapore','India'],
  americas: ['USA','Mexico'],
  mea:      ['UAE','Egypt','South Africa'],
}

export const MONTHS_ORDERED = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
]

export const SEASONS_ORDERED   = ['Spring','Summer','Autumn','Winter']
export const AGE_GROUPS_ORDERED = ['18–24','25–34','35–44','45–54','55–64','65+']
export const GENDERS_ORDERED    = ['Male','Female','Non-binary']

export const ALL_YEARS  = [...new Set(TOURISM_RECORDS.map(r => r.dateOfVisit.slice(0,4)))].sort()
export const ALL_MONTHS = MONTHS_ORDERED
export const ALL_DESTS  = [...new Set(TOURISM_RECORDS.map(r => r.destination))].sort()
export const ALL_ORIGINS = [...new Set(TOURISM_RECORDS.map(r => r.originLocation))].sort()
export const ALL_PURPOSES = [...new Set(TOURISM_RECORDS.map(r => r.travelPurpose))].sort()

// ── Generic helpers ───────────────────────────────────────────────────────

export const sum  = (arr, fn) => arr.reduce((a, r) => a + fn(r), 0)
export const mean = (arr, fn) => arr.length ? sum(arr, fn) / arr.length : 0

const groupBy = (arr, fn) => {
  const m = new Map()
  for (const item of arr) {
    const key = fn(item)
    if (!m.has(key)) m.set(key, [])
    m.get(key).push(item)
  }
  return m
}
const sortedEntries = (map, desc = true) =>
  [...map.entries()].sort((a, b) => desc ? b[1] - a[1] : a[1] - b[1])

const monthIndex = iso => parseInt(iso.slice(5, 7), 10) - 1

// ── 9-dimension filter predicate ─────────────────────────────────────────

/**
 * @param {Object} filters
 * @param {string} filters.year         – '2022'|'2023'|'2024'|'all'
 * @param {string} filters.month        – 'Jan'…'Dec'|'all'
 * @param {string} filters.destination  – exact destination string|'all'
 * @param {string} filters.season       – 'Spring'…'Winter'|'all'
 * @param {string} filters.visitorType  – 'International'|'Domestic'|'all'
 * @param {string} filters.origin       – exact origin string|'all'
 * @param {string} filters.ageGroup     – '18–24'…'65+'|'all'
 * @param {string} filters.gender       – 'Male'|'Female'|'Non-binary'|'all'
 * @param {string} filters.purpose      – exact travelPurpose|'all'
 */
export function applyFilters(filters = {}) {
  const {
    year = 'all', month = 'all', destination = 'all',
    season = 'all', visitorType = 'all', origin = 'all',
    ageGroup = 'all', gender = 'all', purpose = 'all',
    // legacy region/type support
    region = 'all', type = 'all',
  } = filters

  return TOURISM_RECORDS.filter(r => {
    if (year        !== 'all' && !r.dateOfVisit.startsWith(year))              return false
    if (month       !== 'all' && MONTHS_ORDERED[monthIndex(r.dateOfVisit)] !== month) return false
    if (destination !== 'all' && r.destination    !== destination)             return false
    if (season      !== 'all' && r.season         !== season)                  return false
    if (visitorType !== 'all' && r.visitorType    !== visitorType)             return false
    if (origin      !== 'all' && r.originLocation !== origin)                  return false
    if (ageGroup    !== 'all' && r.ageGroup       !== ageGroup)                return false
    if (gender      !== 'all' && r.gender         !== gender)                  return false
    if (purpose     !== 'all' && r.travelPurpose  !== purpose)                 return false

    // legacy region filter
    if (region !== 'all') {
      const frags = REGION_DEST_FRAGMENTS[region] ?? []
      if (!frags.some(f => r.destination.includes(f))) return false
    }
    // legacy type filter (maps short codes to full purpose strings)
    if (type !== 'all') {
      const map = { leisure: 'Leisure / Holiday', business: 'Business / MICE', transit: 'Transit' }
      if (map[type] && r.travelPurpose !== map[type]) return false
    }
    return true
  })
}

// ── KPI derivation ────────────────────────────────────────────────────────

export function computeKpis() {
  return computeFilteredKpis({ year:'all', month:'all', destination:'all', season:'all',
    visitorType:'all', origin:'all', ageGroup:'all', gender:'all', purpose:'all' })
}

export function computeFilteredKpis(filters) {
  const rows = applyFilters(filters)
  if (rows.length === 0) {
    return {
      totalVisitors:0, domesticVisitors:0, internationalVisitors:0,
      mostPopularDest:'—', avgLengthOfStay:0, avgDailySpend:0,
      recordCount:0, domesticPct:0, internationalPct:0,
    }
  }

  const totalVisitors         = sum(rows, r => r.numberOfVisitors)
  const domesticRows          = rows.filter(r => r.visitorType === 'Domestic')
  const intlRows              = rows.filter(r => r.visitorType === 'International')
  const domesticVisitors      = sum(domesticRows, r => r.numberOfVisitors)
  const internationalVisitors = sum(intlRows,     r => r.numberOfVisitors)
  const avgLengthOfStay       = +(mean(rows, r => r.lengthOfStay)).toFixed(1)
  const avgDailySpend         = Math.round(mean(rows, r => r.avgDailySpend))

  const destMap = new Map()
  for (const r of rows) destMap.set(r.destination, (destMap.get(r.destination) ?? 0) + r.numberOfVisitors)
  const mostPopularDest = sortedEntries(destMap)[0]?.[0] ?? '—'

  return {
    totalVisitors, domesticVisitors, internationalVisitors,
    mostPopularDest, avgLengthOfStay, avgDailySpend,
    recordCount: rows.length,
    domesticPct:      totalVisitors ? +((domesticVisitors      / totalVisitors)*100).toFixed(1) : 0,
    internationalPct: totalVisitors ? +((internationalVisitors / totalVisitors)*100).toFixed(1) : 0,
  }
}

// ── Comprehensive chart-data derivation ──────────────────────────────────

/**
 * Derives every chart dataset from a filtered record slice.
 * Returns a single object consumed by all chart components.
 */
export function computeFilteredChartData(filters) {
  const rows = applyFilters(filters)

  // 1 — Monthly arrivals (multi-year lines)
  const years = ALL_YEARS
  const monthlyArrivals = years.map(yr => {
    const data = Array(12).fill(0)
    rows.filter(r => r.dateOfVisit.startsWith(yr))
        .forEach(r => { data[monthIndex(r.dateOfVisit)] += r.numberOfVisitors })
    return { year: yr, data }
  })

  // 2 — Visitors by destination (top 12)
  const destVisitors = new Map()
  for (const r of rows) destVisitors.set(r.destination, (destVisitors.get(r.destination) ?? 0) + r.numberOfVisitors)
  const topDests = sortedEntries(destVisitors).slice(0, 12)
    .map(([dest, count]) => ({ dest: dest.replace(/, .+$/, ''), fullDest: dest, count }))

  // 3 — Seasonal visitors (stacked: intl vs domestic)
  const seasonIntl = new Map(), seasonDom = new Map()
  for (const r of rows) {
    const v = r.numberOfVisitors
    if (r.visitorType === 'International') seasonIntl.set(r.season, (seasonIntl.get(r.season) ?? 0) + v)
    else                                   seasonDom .set(r.season, (seasonDom .get(r.season) ?? 0) + v)
  }
  const seasonalData = SEASONS_ORDERED.map(s => ({
    season: s,
    international: seasonIntl.get(s) ?? 0,
    domestic:      seasonDom .get(s) ?? 0,
    total:        (seasonIntl.get(s) ?? 0) + (seasonDom.get(s) ?? 0),
  }))

  // 4 — Age group donut
  const ageMap = new Map()
  for (const r of rows) ageMap.set(r.ageGroup, (ageMap.get(r.ageGroup) ?? 0) + r.numberOfVisitors)
  const ageGroupData = AGE_GROUPS_ORDERED
    .filter(a => ageMap.has(a))
    .map(a => ({ name: a, value: ageMap.get(a) }))

  // 5 — Dom vs Intl donut
  const domVisitors  = sum(rows.filter(r => r.visitorType === 'Domestic'),      r => r.numberOfVisitors)
  const intlVisitors = sum(rows.filter(r => r.visitorType === 'International'),  r => r.numberOfVisitors)
  const domIntlData = [
    { name: 'Domestic',      value: domVisitors  },
    { name: 'International', value: intlVisitors },
  ]

  // 6 — Gender distribution
  const genderMap = new Map()
  for (const r of rows) genderMap.set(r.gender, (genderMap.get(r.gender) ?? 0) + r.numberOfVisitors)
  const genderData = GENDERS_ORDERED
    .filter(g => genderMap.has(g))
    .map(g => ({ name: g, value: genderMap.get(g) }))

  // 7 — Origin distribution (top 10 international sources)
  const originMap = new Map()
  for (const r of rows.filter(r => r.visitorType === 'International'))
    originMap.set(r.originLocation, (originMap.get(r.originLocation) ?? 0) + r.numberOfVisitors)
  const originData = sortedEntries(originMap).slice(0, 10)
    .map(([country, count]) => ({ country, count }))

  // 8 — Avg spend by destination (top 12)
  const spendGroups = groupBy(rows, r => r.destination)
  const spendByDest = sortedEntries(
    new Map([...spendGroups.entries()].map(([d, arr]) => [d, Math.round(mean(arr, r => r.avgDailySpend))]))
  ).slice(0, 12).map(([dest, avg]) => ({ dest: dest.replace(/, .+$/, ''), fullDest: dest, avg }))

  // 9 — Avg length of stay by destination (top 12)
  const stayGroups = groupBy(rows, r => r.destination)
  const stayByDest = sortedEntries(
    new Map([...stayGroups.entries()].map(([d, arr]) => [d, +(mean(arr, r => r.lengthOfStay)).toFixed(1)]))
  ).slice(0, 12).map(([dest, avg]) => ({ dest: dest.replace(/, .+$/, ''), fullDest: dest, avg }))

  // ── Insights derivation ───────────────────────────────────────────────

  // Peak season
  const peakSeason = seasonalData.reduce((a, b) => b.total > a.total ? b : a, seasonalData[0] ?? { season:'—', total:0 })

  // Most visited destination
  const mostVisited = topDests[0] ?? { fullDest: '—', count: 0 }

  // Fastest-growing destination: compare current-year vs prior-year visitor count
  const currYear = (filters.year && filters.year !== 'all') ? filters.year : '2024'
  const prevYear = String(parseInt(currYear, 10) - 1)
  const currRows = rows.filter(r => r.dateOfVisit.startsWith(currYear))
  const prevRows = applyFilters({ ...filters, year: prevYear })
  const currDestMap = new Map(), prevDestMap = new Map()
  for (const r of currRows) currDestMap.set(r.destination, (currDestMap.get(r.destination) ?? 0) + r.numberOfVisitors)
  for (const r of prevRows) prevDestMap.set(r.destination, (prevDestMap.get(r.destination) ?? 0) + r.numberOfVisitors)
  let fastestGrowing = { dest: '—', growthPct: 0 }
  for (const [dest, curr] of currDestMap) {
    const prev = prevDestMap.get(dest) ?? 0
    if (prev > 0) {
      const pct = +((( curr - prev) / prev) * 100).toFixed(1)
      if (pct > fastestGrowing.growthPct) fastestGrowing = { dest: dest.replace(/, .+$/, ''), growthPct: pct }
    }
  }

  // Major demographic
  const majorAge = ageGroupData.reduce((a, b) => b.value > a.value ? b : a, ageGroupData[0] ?? { name:'—', value:0 })

  // Dom vs Intl trend label
  const domIntlTrend = domVisitors > intlVisitors
    ? `Domestic leading (${Math.round((domVisitors/(domVisitors+intlVisitors||1))*100)}%)`
    : `International leading (${Math.round((intlVisitors/(domVisitors+intlVisitors||1))*100)}%)`

  // Highest avg spend destination
  const highSpendDest = spendByDest[0] ?? { fullDest: '—', avg: 0 }

  const insights = {
    peakSeason: peakSeason.season,
    peakSeasonVisitors: peakSeason.total,
    mostVisited: mostVisited.fullDest,
    mostVisitedCount: mostVisited.count,
    fastestGrowing: fastestGrowing.dest,
    fastestGrowingPct: fastestGrowing.growthPct,
    majorAgeGroup: majorAge.name,
    domIntlTrend,
    highSpendDest: highSpendDest.fullDest,
    highSpendAvg: highSpendDest.avg,
  }

  return {
    monthlyArrivals, topDests, seasonalData,
    ageGroupData, domIntlData, genderData,
    originData, spendByDest, stayByDest,
    insights, totalRows: rows.length,
  }
}

// ── Static memoised exports (full-dataset, no filters) ───────────────────

export const KPIS                   = computeKpis()
export const TOP_DESTINATIONS       = sortedEntries(
  (() => { const m = new Map(); for (const r of TOURISM_RECORDS) m.set(r.destination,(m.get(r.destination)??0)+1); return m })()
).slice(0,10)
export const ORIGIN_DISTRIBUTION    = (() => {
  const intl = TOURISM_RECORDS.filter(r=>r.visitorType==='International')
  const m = new Map(); for (const r of intl) m.set(r.originLocation,(m.get(r.originLocation)??0)+1)
  const total = intl.length
  return sortedEntries(m).slice(0,10).map(([country,count])=>({country,count,pct:+((count/total)*100).toFixed(1)}))
})()
export const AGE_DISTRIBUTION       = (() => {
  const m = new Map(); for (const r of TOURISM_RECORDS) m.set(r.ageGroup,(m.get(r.ageGroup)??0)+1)
  const total = TOURISM_RECORDS.length
  return AGE_GROUPS_ORDERED.filter(k=>m.has(k)).map(k=>({name:k,value:+((m.get(k)/total)*100).toFixed(1)}))
})()
export const PURPOSE_DIST           = (() => {
  const m = new Map(); for (const r of TOURISM_RECORDS) m.set(r.travelPurpose,(m.get(r.travelPurpose)??0)+1)
  const total = TOURISM_RECORDS.length
  return sortedEntries(m).map(([name,count])=>({name,value:+((count/total)*100).toFixed(1)}))
})()
export const SPEND_BY_DEST          = (() => {
  const g = groupBy(TOURISM_RECORDS, r=>r.destination)
  const entries = [...g.entries()].map(([d,arr])=>[d,Math.round(mean(arr,r=>r.avgDailySpend))]).sort((a,b)=>b[1]-a[1]).slice(0,10)
  return { labels: entries.map(([d])=>d.replace(/,.+$/,'')), values: entries.map(([,v])=>v) }
})()
export const SEASONAL_DIST          = (() => {
  const m = new Map(); for (const r of TOURISM_RECORDS) m.set(r.season,(m.get(r.season)??0)+r.numberOfVisitors)
  return SEASONS_ORDERED.map(s=>({name:s,value:m.get(s)??0}))
})()
export const GENDER_DIST            = (() => {
  const m = new Map(); for (const r of TOURISM_RECORDS) m.set(r.gender,(m.get(r.gender)??0)+1)
  const total = TOURISM_RECORDS.length
  return sortedEntries(m).map(([name,count])=>({name,value:+((count/total)*100).toFixed(1)}))
})()
export const ACCOMM_DIST            = (() => {
  const m = new Map(); for (const r of TOURISM_RECORDS) m.set(r.accommodationType,(m.get(r.accommodationType)??0)+1)
  const total = TOURISM_RECORDS.length
  return sortedEntries(m).map(([name,count])=>({name,value:+((count/total)*100).toFixed(1)}))
})()
export const STAY_BY_PURPOSE        = (() => {
  const g = groupBy(TOURISM_RECORDS, r=>r.travelPurpose)
  return sortedEntries(new Map([...g.entries()].map(([k,arr])=>[k,+(mean(arr,r=>r.lengthOfStay)).toFixed(1)]))).map(([purpose,avg])=>({purpose,avg}))
})()
export const VISITOR_TYPE_BY_SEASON = (() => {
  const intl = groupBy(TOURISM_RECORDS.filter(r=>r.visitorType==='International'),r=>r.season)
  const dom  = groupBy(TOURISM_RECORDS.filter(r=>r.visitorType==='Domestic'),r=>r.season)
  return {
    seasons: SEASONS_ORDERED,
    international: SEASONS_ORDERED.map(s=>intl.get(s)?.length??0),
    domestic:      SEASONS_ORDERED.map(s=>dom .get(s)?.length??0),
  }
})()
export const MONTHLY_ARRIVALS = (() => {
  const years = ALL_YEARS
  const result = {}; for (const yr of years) result[yr] = Array(12).fill(0)
  for (const r of TOURISM_RECORDS) {
    const yr = r.dateOfVisit.slice(0,4); if (!result[yr]) continue
    result[yr][monthIndex(r.dateOfVisit)] += r.numberOfVisitors
  }
  return years.map(yr=>({ year:yr, data:result[yr] }))
})()
