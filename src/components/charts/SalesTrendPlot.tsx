import { getPlotTheme } from "@/lib/plotTheme";
import Plot from "react-plotly.js";

type SalesTrendPlotProps = {
  days: string[];
  revenue: number[];
  orders: number[];
  metric: "revenue" | "orders";
  isDark: boolean;
  seriesLabel?: string;
};

export default function SalesTrendPlot({ days, revenue, orders, metric, isDark, seriesLabel }: SalesTrendPlotProps) {
  const t = getPlotTheme(isDark);
  const y = metric === "revenue" ? revenue : orders;
  const hovertemplate =
    metric === "revenue"
      ? `%{x}<br>${seriesLabel ? `${seriesLabel}<br>` : ""}收入：¥ %{y:,.0f}<extra></extra>`
      : `%{x}<br>${seriesLabel ? `${seriesLabel}<br>` : ""}订单：%{y:,}<extra></extra>`;

  return (
    <Plot
      data={[
        {
          type: "scatter",
          mode: "lines+markers",
          x: days,
          y,
          line: { color: t.accent1, width: 2.5 },
          marker: { color: t.accent0, size: 5.5, line: { width: 0 } },
          fill: "tozeroy",
          fillcolor: isDark ? "rgba(46,232,196,0.10)" : "rgba(10,125,122,0.12)",
          hovertemplate,
        },
      ]}
      layout={{
        autosize: true,
        margin: { l: 46, r: 18, t: 8, b: 38 },
        paper_bgcolor: t.surface,
        plot_bgcolor: t.surface,
        font: { color: t.fg, family: "Spline Sans, sans-serif" },
        xaxis: {
          tickfont: { color: t.fgMuted, size: 11 },
          gridcolor: "rgba(0,0,0,0)",
          zeroline: false,
          ticks: "outside",
          tickcolor: t.grid,
        },
        yaxis: {
          tickfont: { color: t.fgMuted, size: 11 },
          gridcolor: t.grid,
          zeroline: false,
          tickformat: metric === "revenue" ? "~s" : ",d",
        },
        hoverlabel: {
          bgcolor: isDark ? "rgba(10,14,20,0.92)" : "rgba(255,255,255,0.92)",
          bordercolor: t.grid,
          font: { color: t.fg, size: 12 },
        },
      }}
      config={{ displayModeBar: false, responsive: true }}
      useResizeHandler
      style={{ width: "100%", height: "320px" }}
    />
  );
}
