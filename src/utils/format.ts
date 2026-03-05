export function formatCompactNumber(n: number) {
  return new Intl.NumberFormat('zh-CN', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(n)
}

export function formatPercent(n: number, digits = 1) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'percent',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n)
}

export function formatCurrencyCny(n: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDeltaPct(delta: number, digits = 1) {
  const sign = delta > 0 ? '+' : ''
  return `${sign}${formatPercent(delta, digits)}`
}

