import { getPlotTheme } from "@/lib/plotTheme";
import Plot from "react-plotly.js";

type RegionPiePlotProps = {
  provinces: string[];
  values: number[];
  isDark: boolean;
};

export default function RegionPiePlot({ provinces, values, isDark }: RegionPiePlotProps) {
  const t = getPlotTheme(isDark);

  const colors = isDark
    ? ["#a3ff2b", "#2ee8c4", "#7aa8ff", "#ffd36b", "#ff7ab6", "#7df0ff", "#c3a6ff", "#ff9f6b", "#63ffb1", "#b8ff63"]
    : ["#2a7a2a", "#0a7d7a", "#2d5aa8", "#a06b00", "#a23a67", "#117787", "#5a3ea8", "#9b4b1f", "#1a8f5a", "#4b7a1a"];

  return (
    <Plot
      data={[
        {
          type: "pie",
          labels: provinces,
          values,
          hole: 0.54,
          sort: false,
          direction: "clockwise",
          marker: { colors, line: { color: isDark ? "rgba(9,12,16,0.85)" : "rgba(255,255,255,0.9)", width: 1 } },
          textinfo: "none",
          hovertemplate: "%{label}<br>%{value:.1f}%<extra></extra>",
        },
      ]}
      layout={{
        autosize: true,
        margin: { l: 0, r: 0, t: 10, b: 0 },
        paper_bgcolor: t.surface,
        plot_bgcolor: t.surface,
        font: { color: t.fg, family: "Spline Sans, sans-serif" },
        legend: {
          orientation: "v",
          x: 1.02,
          y: 0.5,
          xanchor: "left",
          yanchor: "middle",
          font: { size: 11, color: t.fgMuted },
          bgcolor: "rgba(0,0,0,0)",
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

