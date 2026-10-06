export const Colors = {
  background: '#CAF7E2',
  surface: '#FFFFFF',
  primary: '#386150',
  accent: '#F59E0B',
  muted: '#6F8F82',
  text: '#386150',
  textOnDark: '#FFFFFF',
  textOnAccent: '#386150',
  border: '#386150',
  danger: '#DC2626',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const Radii = {
  sm: 8,
  md: 16,
  lg: 20,
  pill: 999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#386150',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
} as const;

export const Typography = {
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  title: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  heading: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  display: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
} as const;

export const Layout = {
  baseWidth: 428,
  baseHeight: 926,
  tabBarHeight: 84,
  appBarHeight: 64,
} as const;
