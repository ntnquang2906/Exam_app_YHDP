import { Platform } from 'react-native';

// Design tokens lấy từ bản mock UI (YHDP_UI_UX_Mockup.pdf).
// Đổi màu/khoảng cách ở đây, mọi màn hình tự cập nhật.

export const colors = {
  primary: '#1F7A4D',
  primaryDark: '#17603C',
  primarySoft: '#E3F1E8',
  primaryMid: '#9FD3B3',
  bg: '#F4F3EE',
  surface: '#FFFFFF',
  surfaceMuted: '#EFEEE8',
  border: '#E2E0D8',
  text: '#16201B',
  muted: '#5E6862',
  faint: '#8A928D',
  dark: '#13201A',
  darkSoft: '#1F2E27',
  danger: '#B4541A',
  dangerSoft: '#FBEBDD',
  warnSoft: '#FDF1DE',
  warnText: '#8A4A0F',
  blue: '#2563A8',
  blueSoft: '#E4EEF8',
  orange: '#C2571A',
  ministry: '#9B1C1C',
  white: '#FFFFFF',
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const font = {
  h1: { fontSize: 26, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 16, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, color: colors.text, lineHeight: 22 },
  small: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  tiny: { fontSize: 11, color: colors.muted },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.8, color: colors.muted },
  serif: { fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }), fontSize: 17, lineHeight: 26, color: colors.text },
};

// Mốc độ rộng để chuyển bố cục điện thoại -> máy tính
export const BREAKPOINT_WIDE = 900;
