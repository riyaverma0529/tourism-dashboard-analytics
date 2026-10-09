# GitHub Setup — Tourism Dashboard Analytics

Push this project to: **https://github.com/riyaverma0529/tourism-dashboard-analytics**

---

## Prerequisites

1. [Install Git](https://git-scm.com/downloads) if not already installed
2. [Install Node.js 18+](https://nodejs.org/) if not already installed
3. Have a GitHub account with access to `riyaverma0529/tourism-dashboard-analytics`

---

## One-time setup — run these commands in your terminal

```bash
# 1. Navigate to the project folder
cd "C:\Users\hp\OneDrive\Desktop\Tourism Dashbord Analytics\tourism-react"

# 2. Install dependencies (if not already done)
npm install

# 3. Regenerate the dataset (optional — already generated)
npm run generate-data

# 4. Verify the build passes
npm run build

# 5. Initialise git repo
git init

# 6. Stage all files
git add .

# 7. Create initial commit
git commit -m "feat: Tourism & Visitor Analytics Dashboard — React + Vite

- 9-dimension interactive filter panel (year, month, destination,
  season, visitorType, origin, ageGroup, gender, purpose)
- 6 filter-reactive KPI cards with animated count-up
- 9 fully interactive ECharts visualisations:
    • Tourism arrivals line chart (multi-year)
    • Visitors by destination horizontal bar chart
    • Seasonal stacked area chart (Dom vs Intl)
    • Age demographics donut chart
    • Domestic vs International donut chart
    • Gender Nightingale rose chart
    • Visitor origin geographic bar chart
    • Average spending by destination bar chart
    • Average length of stay by destination bar chart
- Tourism Insights auto-highlight panel (6 KPIs)
- 1 000-record synthetic dataset with 14 fields + CSV export
- Fully responsive: desktop, tablet, mobile"

# 8. Set the remote to your GitHub repo
git remote add origin https://github.com/riyaverma0529/tourism-dashboard-analytics.git

# 9. Rename branch to main (GitHub default)
git branch -M main

# 10. Push to GitHub
git push -u origin main
```

If you get an authentication error on step 10, use a Personal Access Token (PAT):

```bash
# Replace YOUR_TOKEN with your GitHub PAT
git remote set-url origin https://YOUR_TOKEN@github.com/riyaverma0529/tourism-dashboard-analytics.git
git push -u origin main
```

---

## After pushing — enable GitHub Pages (optional)

1. Go to **Settings → Pages** in your GitHub repo
2. Set **Source** → `GitHub Actions`
3. The included `vite.config.js` builds to `dist/` — add this workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Running locally

```bash
npm run dev          # → http://localhost:5173
npm run build        # production build → dist/
npm run preview      # preview production build
npm run generate-data # regenerate 1 000-record dataset
```
