import PlotlyChart from '@/components/PlotlyChart'
import type { HeatmapData } from '@/data/types'

const grid = 'rgba(255,255,255,0.08)'

const colorscale: Plotly.ColorScale = [
  [0, 'rgba(255,255,255,0.06)'],
  [0.25, 'rgba(70,230,255,0.22)'],
  [0.55, 'rgba(70,230,255,0.55)'],
  [0.78, 'rgba(70,230,255,0.82)'],
  [1, 'rgba(255,183,74,0.95)'],
]

export default function ActivityHeatmapChart({ data }: { data: HeatmapData }) {
  return (
    <PlotlyChart
      data={[
        {
          type: 'heatmap',
          x: data.hours,
          y: data.days,
          z: data.values,
          colorscale,
          hovertemplate: '%{y} %{x}:00<br>活跃度：%{z}<extra></extra>',
          showscale: true,
          colorbar: {
            thickness: 10,
            outlinewidth: 0,
            tickfont: { color: 'rgba(255,255,255,0.55)', size: 10 },
          },
        },
      ]}
      layout={{
        margin: { l: 46, r: 22, t: 10, b: 34 },
        xaxis: {
          dtick: 3,
          tickfont: { color: 'rgba(255,255,255,0.55)' },
          gridcolor: grid,
          zeroline: false,
        },
        yaxis: {
          tickfont: { color: 'rgba(255,255,255,0.55)' },
          gridcolor: grid,
          zeroline: false,
          autorange: 'reversed',
          categoryorder: 'array',
          categoryarray: data.days,
        },
        hoverlabel: {
          bgcolor: 'rgba(12,18,26,0.95)',
          bordercolor: 'rgba(255,255,255,0.12)',
          font: { color: 'rgba(255,255,255,0.9)' },
        },
      }}
      height={320}
      className="overflow-hidden rounded-xl border border-white/10"
    />
  )
}

