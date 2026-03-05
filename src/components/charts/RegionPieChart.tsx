import PlotlyChart from '@/components/PlotlyChart'
import type { RegionSlice } from '@/data/types'

const palette = [
  'rgba(70,230,255,0.95)',
  'rgba(70,230,255,0.72)',
  'rgba(70,230,255,0.55)',
  'rgba(70,230,255,0.40)',
  'rgba(255,183,74,0.70)',
  'rgba(255,183,74,0.52)',
  'rgba(255,183,74,0.40)',
  'rgba(255,255,255,0.22)',
  'rgba(255,255,255,0.16)',
  'rgba(255,255,255,0.12)',
]

export default function RegionPieChart({ data }: { data: RegionSlice[] }) {
  const labels = data.map((d) => d.province)
  const values = data.map((d) => d.value)

  return (
    <PlotlyChart
      data={[
        {
          type: 'pie',
          labels,
          values,
          hole: 0.54,
          sort: false,
          direction: 'clockwise',
          marker: { colors: palette, line: { color: 'rgba(255,255,255,0.06)', width: 1 } },
          textinfo: 'none',
          hovertemplate: '%{label}<br>贡献：%{value:,}<br>占比：%{percent}<extra></extra>',
        },
      ]}
      layout={{
        margin: { l: 10, r: 10, t: 10, b: 58 },
        showlegend: true,
        legend: {
          orientation: 'h',
          x: 0,
          xanchor: 'left',
          y: -0.12,
          yanchor: 'top',
          font: { color: 'rgba(255,255,255,0.62)', size: 11 },
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
