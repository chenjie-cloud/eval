import PlotlyChart from '@/components/PlotlyChart'
import type { TrendPoint } from '@/data/types'

const grid = 'rgba(255,255,255,0.08)'

export default function SalesTrendChart({ points }: { points: TrendPoint[] }) {
  const x = points.map((p) => p.date)
  const y = points.map((p) => p.value)

  return (
    <PlotlyChart
      data={[
        {
          type: 'scatter',
          mode: 'lines',
          x,
          y,
          line: { color: 'rgba(70,230,255,0.95)', width: 3, shape: 'spline' },
          fill: 'tozeroy',
          fillcolor: 'rgba(70,230,255,0.10)',
          hovertemplate: '%{x}<br>收入：¥%{y:,}<extra></extra>',
        },
      ]}
      layout={{
        xaxis: {
          showgrid: false,
          tickfont: { color: 'rgba(255,255,255,0.55)' },
          ticks: '',
          tickformat: '%m-%d',
        },
        yaxis: {
          gridcolor: grid,
          zeroline: false,
          tickfont: { color: 'rgba(255,255,255,0.55)' },
          tickformat: '~s',
        },
        hoverlabel: {
          bgcolor: 'rgba(12,18,26,0.95)',
          bordercolor: 'rgba(255,255,255,0.12)',
          font: { color: 'rgba(255,255,255,0.9)' },
        },
      }}
      height={320}
      className="overflow-hidden rounded-xl border border-white/10 bg-white/0"
    />
  )
}

