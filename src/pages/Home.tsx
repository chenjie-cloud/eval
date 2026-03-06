import Card from "@/components/Card";
import KpiCard from "@/components/KpiCard";
import ActivityHeatmapPlot from "@/components/charts/ActivityHeatmapPlot";
import RegionPiePlot from "@/components/charts/RegionPiePlot";
import SalesTrendPlot from "@/components/charts/SalesTrendPlot";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Banknote, ChevronDown, Moon, RefreshCcw, Sun, TrendingUp, Users, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { createDashboardMock } from "@/utils/dashboardMock";

function IconButton({
  label,
  onClick,
  children,
  tone = "neutral",
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  tone?: "neutral" | "accent";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-1)]";
  const cls =
    tone === "accent"
      ? "border-[rgba(163,255,43,0.22)] bg-[rgba(163,255,43,0.10)] text-[var(--text-0)] hover:bg-[rgba(163,255,43,0.14)]"
      : "border-[rgba(240,248,255,0.10)] bg-[rgba(255,255,255,0.04)] text-[var(--text-1)] hover:bg-[rgba(255,255,255,0.06)]";

  return (
    <button type="button" aria-label={label} onClick={onClick} className={cn(base, cls)}>
      {children}
    </button>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-xl border border-[rgba(240,248,255,0.12)] bg-[rgba(255,255,255,0.03)] p-1">
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
              active
                ? "bg-[rgba(163,255,43,0.14)] text-[var(--text-0)]"
                : "text-[var(--text-2)] hover:text-[var(--text-1)]",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const [seed, setSeed] = useState(1);
  const mock = useMemo(() => createDashboardMock(seed), [seed]);
  const [salesMetric, setSalesMetric] = useState<"revenue" | "orders">("revenue");
  const [activeProvince, setActiveProvince] = useState<string | null>(null);

  const snapshotTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleString("zh-CN", { hour12: false });
  }, [seed]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-14 pt-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.18em] text-[var(--text-2)]">BUSINESS OVERVIEW</p>
          <h1 className="mt-3 text-3xl font-semibold text-[var(--text-0)]">数据看板</h1>
          <p className="mt-2 text-sm text-[var(--text-1)]">
            近 30 天趋势 · 省份结构 · 日-小时活跃分布
            <span className="ml-2 text-xs text-[var(--text-2)]">· 快照 {snapshotTime}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <IconButton label="刷新数据" tone="accent" onClick={() => setSeed(s => s + 1)}>
            <RefreshCcw className="h-4 w-4" />
            刷新
          </IconButton>
          <IconButton label="切换主题" onClick={toggleTheme}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDark ? "浅色" : "深色"}
          </IconButton>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          label="用户数"
          value={mock.format.users(mock.kpis.users)}
          hint="较昨日"
          delta={{
            value: mock.format.deltaPercent(mock.kpis.usersDelta),
            tone: mock.kpis.usersDelta > 0.001 ? "up" : mock.kpis.usersDelta < -0.001 ? "down" : "flat",
          }}
          icon={<Users className="h-5 w-5" />}
        />
        <KpiCard
          label="转化率"
          value={mock.format.percent(mock.kpis.conversionRate)}
          hint="近 7 日均值"
          delta={{
            value: mock.format.deltaPp(mock.kpis.conversionDelta),
            tone: mock.kpis.conversionDelta > 0.0002 ? "up" : mock.kpis.conversionDelta < -0.0002 ? "down" : "flat",
          }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KpiCard
          label="日均收入"
          value={mock.format.currencyCompact(mock.kpis.avgDailyRevenue)}
          hint="近 30 日均值"
          delta={{
            value: mock.format.deltaPercent(mock.kpis.revenueDelta),
            tone: mock.kpis.revenueDelta > 0.001 ? "up" : mock.kpis.revenueDelta < -0.001 ? "down" : "flat",
          }}
          icon={<Banknote className="h-5 w-5" />}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card
          title="销售趋势"
          subtitle={activeProvince ? `近 30 天 · ${activeProvince}` : "近 30 天（示例数据）"}
          className="lg:col-span-7"
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  aria-label="选择省份"
                  value={activeProvince ?? ""}
                  onChange={e => setActiveProvince(e.target.value ? e.target.value : null)}
                  className="appearance-none rounded-xl border border-[rgba(240,248,255,0.12)] bg-[rgba(255,255,255,0.03)] px-3 py-2 pr-8 text-xs font-semibold text-[var(--text-1)] transition-colors hover:bg-[rgba(255,255,255,0.05)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-1)]"
                >
                  <option value="">全部省份</option>
                  {mock.regions.provinces.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-2)]">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              {activeProvince && (
                <button
                  type="button"
                  aria-label="清除省份筛选"
                  onClick={() => setActiveProvince(null)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[rgba(240,248,255,0.12)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs font-semibold text-[var(--text-1)] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                >
                  {activeProvince}
                  <X className="h-4 w-4" />
                </button>
              )}
              <Segmented
                value={salesMetric}
                onChange={v => setSalesMetric(v as "revenue" | "orders")}
                options={[
                  { value: "revenue", label: "收入" },
                  { value: "orders", label: "订单" },
                ]}
              />
            </div>
          }
        >
          <SalesTrendPlot
            days={mock.sales.days}
            revenue={activeProvince ? mock.sales.byProvince[activeProvince]?.revenue ?? mock.sales.revenue : mock.sales.revenue}
            orders={activeProvince ? mock.sales.byProvince[activeProvince]?.orders ?? mock.sales.orders : mock.sales.orders}
            metric={salesMetric}
            isDark={isDark}
            seriesLabel={activeProvince ?? undefined}
          />
        </Card>

        <Card title="地区分布" subtitle="不同省份（点击扇区联动）" className="lg:col-span-5">
          <div className="grid gap-4">
            <RegionPiePlot
              provinces={mock.regions.provinces}
              values={mock.regions.values}
              isDark={isDark}
              selectedProvince={activeProvince ?? undefined}
              onSelectProvince={p => setActiveProvince(prev => (prev === p ? null : p))}
              height={236}
            />

            <div className="grid grid-cols-2 gap-2">
              {mock.regions.provinces
                .map((p, i) => ({ province: p, value: mock.regions.values[i] ?? 0 }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 6)
                .map(item => {
                  const active = item.province === activeProvince;
                  return (
                    <button
                      key={item.province}
                      type="button"
                      onClick={() => setActiveProvince(prev => (prev === item.province ? null : item.province))}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                        active
                          ? "border-[rgba(163,255,43,0.26)] bg-[rgba(163,255,43,0.12)] text-[var(--text-0)]"
                          : "border-[rgba(240,248,255,0.10)] bg-[rgba(255,255,255,0.03)] text-[var(--text-1)] hover:bg-[rgba(255,255,255,0.05)]",
                      )}
                    >
                      <span className="truncate">{item.province}</span>
                      <span className={cn("tabular-nums", active ? "text-[var(--text-0)]" : "text-[var(--text-2)]")}>
                        {item.value.toFixed(1)}%
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </Card>

        <Card title="用户活跃度" subtitle="日-小时热力图（示例数据）" className="lg:col-span-12">
          <ActivityHeatmapPlot
            weekdays={mock.activity.weekdays}
            hours={mock.activity.hours}
            z={mock.activity.z}
            isDark={isDark}
          />
        </Card>
      </section>
    </main>
  );
}
