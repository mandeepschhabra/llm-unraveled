export const COLORS = {
  void: '#0a0a1a',
  voidLight: '#12122a',
  voidLighter: '#1a1a3a',
  neonCyan: '#00f0ff',
  neonMagenta: '#ff00e5',
  neonGold: '#ffd700',
  neonBlue: '#4d7cff',
  neonGreen: '#00ff88',
  neonRed: '#ff3355',
  beamBlue: '#00aaff',
  textPrimary: '#e8e8f0',
  textMuted: '#8888aa',
} as const

export const BEAD_COLORS = [
  '#00f0ff',
  '#ff00e5',
  '#ffd700',
  '#4d7cff',
  '#00ff88',
  '#ff8844',
  '#aa66ff',
  '#ff6699',
] as const

export function beadColor(index: number): string {
  return BEAD_COLORS[index % BEAD_COLORS.length]
}
