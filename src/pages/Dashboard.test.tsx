import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Dashboard from '@/pages/Dashboard'

vi.mock('react-plotly.js', () => ({
  default: function PlotMock() {
    return <div data-testid="plot" />
  },
}))

describe('Dashboard', () => {
  it('renders title and charts', () => {
    render(<Dashboard />)
    expect(screen.getByText('销售数据看板')).toBeInTheDocument()
    expect(screen.getAllByTestId('plot').length).toBeGreaterThanOrEqual(3)
  })
})

