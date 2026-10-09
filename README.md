# Tourism & Visitor Analytics Dashboard

A fully interactive tourism analytics dashboard built with **React + Vite + ECharts**.

## Features

### 9-Dimension Interactive Filters
Year · Month · Destination · Season · Visitor Type · Origin · Age Group · Gender · Travel Purpose

Every chart, KPI card, and insight updates instantly when filters change.

### KPI Cards
| Card | Metric |
|---|---|
| Total Visitors | Sum of all visitors in filtered set |
| Domestic Visitors | Dom split with % of total |
| International Visitors | Intl split with % of total |
| Top Destination | Most visited destination by headcount |
| Avg. Length of Stay | Mean nights per trip |
| Avg. Daily Spend | Mean USD spend per visitor per day |

### Interactive Charts (9)
1. **Tourism Arrivals by Month/Year** — multi-year line + area chart with peak marker
2. **Visitors by Destination** — horizontal bar chart, top 12 destinations
3. **Visitors by Season** — stacked area chart (International vs Domestic)
4. **Age Group Demographics** — donut chart with % labels
5. **Domestic vs International** — donut chart with animated split bar
6. **Visitors by Gender** — Nightingale rose chart
7. **Visitor Origin** — geographic-style horizontal bar chart with country flags
8. **Average Spending by Destination** — gradient bar chart with average markline
9. **Avg. Length of Stay by Destination** — bar chart with average markline

### Tourism Insights Panel
Auto-generated highlights that update with every filter change:
- Peak tourism season
- Most visited destination
- Fastest-growing destination (YoY)
- Major visitor demographic
- Domestic vs International visitor trend
- Destination with highest average spending

### Dataset
1 000 synthetic tourism records with 14 fields — exportable as CSV.

## Tech Stack
- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [Apache ECharts 5](https://echarts.apache.org/)

## Quick Start

```bash
npm install
npm run dev          # → http://localhost:5173
npm run build        # production build
npm run generate-data # regenerate dataset
```

See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for GitHub push instructions.
