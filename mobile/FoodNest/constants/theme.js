// FoodNest design system
// Centralized design tokens so every screen/component pulls from one source
// of truth instead of hard-coding colors, spacing or type sizes.

export const colors = {
  primary: '#E85D2A',      // FoodNest orange — warm, appetite-driven, distinctive
  primaryDark: '#C6491E',
  secondary: '#1F6E5C',    // deep herb green — accents and success moments
  background: '#FBF8F5',   // warm off-white
  surface: '#FFFFFF',
  text: '#201A17',
  mutedText: '#7A7069',
  success: '#1F8A50',
  warning: '#C77700',
  error: '#D4351C',
  border: '#ECE3DC',
  overlay: 'rgba(32, 26, 23, 0.45)',
  disabled: '#D8D0C9',
  white: '#FFFFFF',
};

export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  raised: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const radius = { sm: 8, md: 14, lg: 20, pill: 999 };

export const typography = {
  display: { fontSize: 28, fontWeight: '700', letterSpacing: -0.3 },
  h1: { fontSize: 22, fontWeight: '700' },
  h2: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyStrong: { fontSize: 15, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
  small: { fontSize: 11, fontWeight: '500' },
};

export default { colors, shadow, spacing, radius, typography };
