// Human-Designed Mobile Production Design Tokens
// Synchronized with Web Companion Theme (YtReactNative-Web)

export const Colors = {
  // Canvas & Surfaces (Sensiwise AI / Crowdapps Store Tokens)
  background: '#F4F3F7',
  backgroundSubtle: '#EFEDF3',
  surface: '#FFFFFF',
  surfaceHover: '#F8FAFC',

  // Primary Brand Identity (Sensiwise Deep Purple & Radiant Violet)
  primary: '#7535BC',
  primaryDark: '#6B2FD0',
  primaryLight: '#ECE5FB',
  primaryMuted: '#B79BFF',
  primaryBorder: '#B79BFF',

  // Secondary Accents
  accent: '#6B2FD0',
  accentLight: '#ECE5FB',

  // Typography Hierarchy
  textPrimary: '#14111C',
  textSecondary: '#6A6577',
  textMuted: '#94A3B8',
  textWhite: '#FFFFFF',

  // Structural Borders
  border: '#E3E0E9',
  borderLight: '#EFEDF3',
  borderFocus: '#7535BC',

  // Semantic Status (Matching Google Stitch Specifications)
  success: '#10B981',
  successLight: '#ECFDF5',
  successText: '#065F46',
  successBorder: '#A7F3D0',

  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  warningText: '#92400E',
  warningBorder: '#FDE68A',

  error: '#EF4444',
  errorLight: '#FEF2F2',
  errorText: '#B91C1C',
  errorBorder: '#FECACA',

  // Web Dark Accents & Badges
  darkCanvas: '#14111C',
  darkSurface: '#1F1A29',
  darkSurfaceElevated: '#2A2438',

  // Neutral Tags
  tagBackground: '#ECE5FB',
  tagText: '#7535BC',
  overlayDark: 'rgba(20, 17, 28, 0.78)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Typography = {
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  subhead: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textWhite,
  },
};

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  full: 9999,
};

// Clean refined shadows matching web CSS
export const Shadows = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryButton: {
    shadowColor: '#7535BC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
};

export default {
  Colors,
  Spacing,
  Typography,
  Radius,
  Shadows,
};
