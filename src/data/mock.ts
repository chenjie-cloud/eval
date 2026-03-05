import type { DashboardData, HeatmapData, RegionSlice, TrendPoint } from '@/data/types'

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function roundTo(n: number, digits = 0) {
  const p = 10 ** digits
  return Math.round(n * p) / p
}

function formatDateISO(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildTrend30d(seed = 7): TrendPoint[] {
  const rand = mulberry32(seed)
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  const base = 68000 + rand() * 12000
  const points: TrendPoint[] = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const t = (29 - i) / 29
    const weekly = Math.sin((t * Math.PI * 2 * 4) / 1) * 3200
    const drift = t * (rand() * 9000 + 4000)
    const noise = (rand() - 0.5) * 5200
    const spike = rand() > 0.95 ? 12000 + rand() * 12000 : 0
    const value = Math.max(32000, base + drift + weekly + noise + spike)
    points.push({ date: formatDateISO(d), value: Math.round(value) })
  }

  return points
}

function buildRegions(seed = 11): RegionSlice[] {
  const rand = mulberry32(seed)
  const provinces = ['广东', '江苏', '浙江', '山东', '四川', '河南', '湖北', '福建', '北京', '上海']
  const raw = provinces.map((p, idx) => ({
    province: p,
    value: Math.round(1200 + idx * 160 + rand() * 1100),
  }))
  const topHeavy = raw.map((r, i) => ({ ...r, value: Math.round(r.value * (1.4 - i * 0.03)) }))
  return topHeavy.sort((a, b) => b.value - a.value)
}

function buildActivityHeatmap(seed = 23): HeatmapData {
  const rand = mulberry32(seed)
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const values = days.map((_, dayIdx) => {
    const isWeekend = dayIdx >= 5
    return hours.map((h) => {
      const morning = Math.exp(-((h - 10) ** 2) / 18)
      const evening = Math.exp(-((h - 20) ** 2) / 14)
      const lunch = Math.exp(-((h - 13) ** 2) / 10)
      const shape = (morning * 0.75 + lunch * 0.55 + evening * 1.15) * 100
      const weekendBoost = isWeekend ? 1.12 : 1
      const weekdayBoost = !isWeekend && h >= 19 ? 1.06 : 1
      const jitter = (rand() - 0.5) * 12
      const base = 18 + rand() * 18
      return Math.max(0, Math.round((base + shape + jitter) * weekendBoost * weekdayBoost))
    })
  })

  return { days, hours, values }
}

function buildKpis(seed = 31, trend: TrendPoint[]) {
  const rand = mulberry32(seed)
  const users = Math.round(86000 + rand() * 24000)
  const conversionRate = roundTo(0.028 + rand() * 0.014, 4)
  const avgDailyRevenue = Math.round(trend.reduce((s, p) => s + p.value, 0) / trend.length)

  const usersPct = roundTo((rand() - 0.42) * 0.12, 4)
  const conversionRatePct = roundTo((rand() - 0.48) * 0.09, 4)
  const avgDailyRevenuePct = roundTo((rand() - 0.44) * 0.11, 4)

  return {
    users,
    conversionRate,
    avgDailyRevenue,
    deltas: { usersPct, conversionRatePct, avgDailyRevenuePct },
  }
}

export function getDashboardMock(): DashboardData {
  const trend30d = buildTrend30d()
  const regions = buildRegions()
  const activity = buildActivityHeatmap()
  const kpis = buildKpis(31, trend30d)
  return { kpis, trend30d, regions, activity }
}

