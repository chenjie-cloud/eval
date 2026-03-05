export type KpiSummary = {
  users: number
  conversionRate: number
  avgDailyRevenue: number
  deltas: {
    usersPct: number
    conversionRatePct: number
    avgDailyRevenuePct: number
  }
}

export type TrendPoint = { date: string; value: number }

export type RegionSlice = { province: string; value: number }

export type HeatmapData = {
  days: string[]
  hours: number[]
  values: number[][]
}

export type DashboardData = {
  kpis: KpiSummary
  trend30d: TrendPoint[]
  regions: RegionSlice[]
  activity: HeatmapData
}

