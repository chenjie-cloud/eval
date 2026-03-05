import ChartCard from '@/components/ChartCard'
import KpiCards from '@/components/KpiCards'
import ActivityHeatmapChart from '@/components/charts/ActivityHeatmapChart'
import RegionPieChart from '@/components/charts/RegionPieChart'
import SalesTrendChart from '@/components/charts/SalesTrendChart'
import { getDashboardMock } from '@/data/mock'
import { CalendarDays } from 'lucide-react'

export default function Dashboard() {
  const data = getDashboardMock()

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-10 pt-8">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs text-[color:var(--muted)]">Sales Console</p>
          <h1 className="mt-2 font-[Fraunces] text-2xl font-semibold tracking-[0.01em] text-[color:var(--text)] md:text-3xl">
            销售数据看板
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--muted)]">
            近30天趋势、地区结构与日-小时活跃节律的统一视图。
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-[color:var(--muted)] md:self-auto">
          <CalendarDays className="h-4 w-4 text-[color:var(--accent)]" />
          <span>最近30天</span>
        </div>
      </header>

      <section className="mt-6">
        <KpiCards data={data.kpis} />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="销售趋势" subtitle="按日统计 · 近30天" className="lg:col-span-2" bodyClassName="pt-1">
          <SalesTrendChart points={data.trend30d} />
        </ChartCard>

        <ChartCard title="地区分布" subtitle="不同省份占比" bodyClassName="pt-1">
          <RegionPieChart data={data.regions} />
        </ChartCard>

        <ChartCard title="用户活跃度" subtitle="日 × 小时 热力分布" bodyClassName="pt-1">
          <ActivityHeatmapChart data={data.activity} />
        </ChartCard>
      </section>
    </main>
  )
}
