export function getPlotTheme(isDark: boolean) {
  if (isDark) {
    return {
      fg: "rgba(246,248,252,0.86)",
      fgMuted: "rgba(246,248,252,0.54)",
      grid: "rgba(240,248,255,0.08)",
      accent0: "#a3ff2b",
      accent1: "#2ee8c4",
      surface: "rgba(0,0,0,0)",
    };
  }

  return {
    fg: "rgba(12,16,22,0.86)",
    fgMuted: "rgba(12,16,22,0.52)",
    grid: "rgba(12,16,22,0.10)",
    accent0: "#2a7a2a",
    accent1: "#0a7d7a",
    surface: "rgba(0,0,0,0)",
  };
}

