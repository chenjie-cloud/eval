import { getPlotTheme } from "@/lib/plotTheme";
import Plot from "react-plotly.js";

type ActivityHeatmapPlotProps = {
  weekdays: string[];
  hours: number[];
  z: number[][];
  isDark: boolean;
};

export default function ActivityHeatmapPlot({ weekdays, hours, z, isDark }: ActivityHeatmapPlotProps) {
  const t = getPlotTheme(isDark);

  const colorscale: [number, string][] = isDark
    ? [
        [0, "rgba(246,248,252,0.03)"],
        [0.15, "rgba(46,232,196,0.10)"],
        [0.4, "rgba(46,232,196,0.22)"],
        [0.7, "rgba(163,255,43,0.26)"],
        [1, "rgba(163,255,43,0.44)"],
      ]
    : [
        [0, "rgba(12,16,22,0.03)"],
        [0.2, "rgba(10,125,122,0.12)"],
        [0.5, "rgba(10,125,122,0.22)"],
        [0.8, "rgba(42,122,42,0.28)"],
        [1, "rgba(42,122,42,0.44)"],
      ];

  return (
    <Plot
      data={[
        {
          type: "heatmap",
          x: hours.map(h => `${String(h).padStart(2, "0")}:00`),
          y: weekdays,
          z,
          colorscale,
          showscale: true,
          colorbar: {
            thickness: 10,
            len: 0.86,
            outlinewidth: 0,
            tickfont: { color: t.fgMuted, size: 10 },
          },
          hovertemplate: "%{y} · %{x}<br>活跃度：%{z}<extra></extra>",
        },
      ]}
      layout={{
        autosize: true,
        margin: { l: 62, r: 18, t: 10, b: 44 },
        paper_bgcolor: t.surface,
        plot_bgcolor: t.surface,
        font: { color: t.fg, family: "Spline Sans, sans-serif" },
        xaxis: {
          tickfont: { color: t.fgMuted, size: 10 },
          gridcolor: "rgba(0,0,0,0)",
          tickangle: -18,
          ticks: "outside",
          tickcolor: t.grid,
          zeroline: false,
        },
        yaxis: {
          tickfont: { color: t.fgMuted, size: 11 },
          gridcolor: "rgba(0,0,0,0)",
          ticks: "outside",
          tickcolor: t.grid,
          zeroline: false,
        },
        hoverlabel: {
          bgcolor: isDark ? "rgba(10,14,20,0.92)" : "rgba(255,255,255,0.92)",
          bordercolor: t.grid,
          font: { color: t.fg, size: 12 },
        },
      }}
      config={{ displayModeBar: false, responsive: true }}
      useResizeHandler
      style={{ width: "100%", height: "360px" }}
    />
  );
}

