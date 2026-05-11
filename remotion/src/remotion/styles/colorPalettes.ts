export const colorPalettes = {
  operator: {
    background: '#0c0f14',
    surface: '#141923',
    surfaceAlt: '#1c2430',
    primary: '#cab27d',
    secondary: '#7dd39b',
    accent: '#7ed0ff',
    text: '#f6f1e8',
    muted: 'rgba(246, 241, 232, 0.55)',
    border: 'rgba(255,255,255,0.08)',
    danger: '#ff7b7b'
  },
  terminal: {
    background: '#071018',
    surface: '#0d1722',
    surfaceAlt: '#132334',
    primary: '#58f6c0',
    secondary: '#4ea8ff',
    accent: '#9de5ff',
    text: '#e8fff7',
    muted: 'rgba(232,255,247,0.55)',
    border: 'rgba(88,246,192,0.18)',
    danger: '#ff7c93'
  },
  ledger: {
    background: '#111111',
    surface: '#1a1b1e',
    surfaceAlt: '#23262b',
    primary: '#f0cf79',
    secondary: '#7ee19f',
    accent: '#faf7ef',
    text: '#fffaf0',
    muted: 'rgba(255,250,240,0.55)',
    border: 'rgba(240,207,121,0.16)',
    danger: '#f78585'
  },
  nullsignal: {
    background: '#090b10',
    surface: '#11151d',
    surfaceAlt: '#191f29',
    primary: '#94e1ff',
    secondary: '#ff6d7c',
    accent: '#d7dde8',
    text: '#eef4fb',
    muted: 'rgba(238,244,251,0.52)',
    border: 'rgba(255,255,255,0.08)',
    danger: '#ff8b8b'
  }
} as const;

export type PaletteName = keyof typeof colorPalettes;
