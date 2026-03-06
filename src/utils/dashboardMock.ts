import { clamp, mulberry32 } from "@/utils/prng";

type Kpis = {
  users: number;
  conversionRate: number;
  avgDailyRevenue: number;
  usersDelta: number;
  conversionDelta: number;
  revenueDelta: number;
};

type SalesSeries = {
  days: string[];
  revenue: number[];
};

type RegionShare = {
  provinces: string[];
  values: number[];
};

type ActivityHeatmap = {
  weekdays: string[];
  hours: number[];
  z: number[][];
};

function formatCompactNumber(n: number) {
  return new Intl.NumberFormat("zh-CN", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

function formatCurrencyCompact(n: number) {
  const formatted = formatCompactNumber(n);
  return `¥ ${formatted}`;
}

function formatPercent(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}

function gaussian(x: number, mu: number, sigma: number) {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z);
}

export function createDashboardMock(seed: number) {
  const rnd = mulberry32(seed * 9973 + 101);

  const today = new Date();
  const days: string[] = [];
  const revenue: number[] = [];

  const base = 920_000 + rnd() * 240_000;
  const drift = (rnd() * 2 - 1) * 9_500;
  const weekly = 0.14 + rnd() * 0.08;

  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push(label);

    const dayOfWeek = d.getDay();
    const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 1 + weekly : 1;
    const season = 1 + 0.06 * Math.sin(((29 - i) / 6.0) * Math.PI);
    const noise = (rnd() * 2 - 1) * 65_000;
    const v = clamp(base + drift * (29 - i) + noise, 420_000, 1_900_000) * season * weekendBoost;
    revenue.push(Math.round(v));
  }

  const provinces = ["广东", "江苏", "浙江", "山东", "河南", "四川", "湖北", "福建", "北京", "上海"];
  const raw = provinces.map(() => 0.6 + rnd() * 1.4);
  const total = raw.reduce((a, b) => a + b, 0);
  const values = raw.map(v => Math.round((v / total) * 1000) / 10);

  const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const z: number[][] = weekdays.map((_, wi) => {
    const dayBias = wi <= 4 ? 1.0 : 0.78 + rnd() * 0.08;
    return hours.map(h => {
      const peaks =
        0.9 * gaussian(h, 11.2, 2.1) +
        1.0 * gaussian(h, 20.6, 2.4) +
        0.35 * gaussian(h, 15.4, 2.8);
      const baseNoise = 0.15 + rnd() * 0.16;
      const val = (peaks + baseNoise) * dayBias;
      return Math.round(clamp(val, 0, 1.6) * 100);
    });
  });

  const revenueSum = revenue.reduce((a, b) => a + b, 0);
  const avgDailyRevenue = Math.round(revenueSum / revenue.length);

  const users = Math.round(110_000 + rnd() * 48_000);
  const conversionRate = clamp(0.032 + rnd() * 0.03, 0.015, 0.12);

  const usersDelta = (rnd() * 2 - 1) * 0.06;
  const conversionDelta = (rnd() * 2 - 1) * 0.012;
  const revenueDelta = (rnd() * 2 - 1) * 0.05;

  const kpis: Kpis = {
    users,
    conversionRate,
    avgDailyRevenue,
    usersDelta,
    conversionDelta,
    revenueDelta,
  };

  const sales: SalesSeries = { days, revenue };
  const regions: RegionShare = { provinces, values };
  const activity: ActivityHeatmap = { weekdays, hours, z };

  return {
    seed,
    kpis,
    sales,
    regions,
    activity,
    format: {
      users: (n: number) => new Intl.NumberFormat("zh-CN").format(n),
      currencyCompact: formatCurrencyCompact,
      percent: formatPercent,
      deltaPercent: (d: number) => `${d >= 0 ? "+" : ""}${(d * 100).toFixed(1)}%`,
      deltaPp: (d: number) => `${d >= 0 ? "+" : ""}${(d * 100).toFixed(1)}pp`,
    },
  };
}

