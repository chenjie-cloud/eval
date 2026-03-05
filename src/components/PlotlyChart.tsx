import Plot from 'react-plotly.js'

type PlotlyChartProps = {
  data: Plotly.Data[]
  layout: Partial<Plotly.Layout>
  height?: number
  className?: string
}

const baseLayout: Partial<Plotly.Layout> = {
  autosize: true,
  margin: { l: 44, r: 18, t: 16, b: 34 },
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: 'rgba(255,255,255,0.78)', family: 'IBM Plex Sans' },
}

const config: Partial<Plotly.Config> = {
  displayModeBar: false,
  responsive: true,
}

export default function PlotlyChart({ data, layout, height = 320, className }: PlotlyChartProps) {
  return (
    <div className={className}>
      <Plot
        data={data}
        layout={{ ...baseLayout, height, ...layout }}
        config={config}
        useResizeHandler
        style={{ width: '100%', height }}
      />
    </div>
  )
}

