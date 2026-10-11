import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BREAKPOINT_WIDE, colors, font, radius, space } from '../theme';

export type IconName = React.ComponentProps<typeof Feather>['name'];

// ---------- Hooks ----------
export function useIsWide() {
  const { width } = useWindowDimensions();
  return width >= BREAKPOINT_WIDE;
}

/** Gọi một hàm async (service) và trả về dữ liệu. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    let alive = true;
    fn().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return data;
}

// ---------- Layout ----------
export function Screen({
  children,
  scroll = true,
  footer,
  header,
  bg = colors.bg,
  maxWidth = 720,
  padded = true,
  edges = ['top'],
}: {
  children: ReactNode;
  scroll?: boolean;
  footer?: ReactNode;
  header?: ReactNode;
  bg?: string;
  maxWidth?: number;
  padded?: boolean;
  edges?: ('top' | 'bottom')[];
}) {
  const inner = (
    <View style={[styles.contentWrap, { maxWidth }, padded && { padding: space.lg }]}>{children}</View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={edges}>
      {header}
      {scroll ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          {inner}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{inner}</View>
      )}
      {footer ? (
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <View style={[styles.contentWrap, { maxWidth, flexDirection: 'row', gap: space.sm, padding: space.md }]}>
            {footer}
          </View>
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );
}

export function TopBar({
  title,
  subtitle,
  left = 'back',
  right,
  onLeft,
  children,
}: {
  title?: string;
  subtitle?: string;
  left?: 'back' | 'close' | 'none';
  right?: ReactNode;
  onLeft?: () => void;
  children?: ReactNode;
}) {
  const handle = onLeft ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  return (
    <View style={styles.topBar}>
      <View style={[styles.contentWrap, { maxWidth: 720 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 44 }}>
          {left !== 'none' && (
            <IconButton icon={left === 'back' ? 'chevron-left' : 'x'} label={left === 'back' ? 'Quay lại' : 'Đóng'} onPress={handle} />
          )}
          <View style={{ flex: 1 }}>
            {title ? <Text style={font.h3} numberOfLines={1}>{title}</Text> : null}
            {subtitle ? <Text style={font.tiny} numberOfLines={1}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
        {children}
      </View>
    </View>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  bordered,
  color = colors.text,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  bordered?: boolean;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconBtn,
        bordered && { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
        pressed && { opacity: 0.6 },
      ]}
    >
      <Feather name={icon} size={20} color={color} />
    </Pressable>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, style, pressed && { opacity: 0.85 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Row({ children, gap = space.sm, style }: { children: ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

export function Grid({ children, min = 280, gap = space.md }: { children: ReactNode; min?: number; gap?: number }) {
  // Lưới đơn giản: các con tự xuống dòng theo độ rộng tối thiểu
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
      {React.Children.map(children, (c) =>
        c ? <View style={{ flexGrow: 1, flexBasis: min, minWidth: Math.min(min, 260) }}>{c}</View> : null,
      )}
    </View>
  );
}

// ---------- Text ----------
export function H1({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[font.h1, style]}>{children}</Text>;
}
export function H2({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[font.h2, style]}>{children}</Text>;
}
export function H3({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[font.h3, style]}>{children}</Text>;
}
export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[font.body, style]}>{children}</Text>;
}
export function Small({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[font.small, style]}>{children}</Text>;
}
export function Label({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[font.label, style]}>{typeof children === 'string' ? children.toUpperCase() : children}</Text>;
}

// ---------- Controls ----------
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'light' | 'soft';

export function Button({
  title,
  subtitle,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  style,
  small,
  loading,
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
  loading?: boolean;
}) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: v.bg, borderColor: v.border },
        disabled && { backgroundColor: colors.surfaceMuted, borderColor: colors.surfaceMuted },
        pressed && !disabled && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Row gap={6}>
            {icon ? <Feather name={icon} size={small ? 14 : 16} color={disabled ? colors.faint : v.fg} /> : null}
            <Text style={{ color: disabled ? colors.faint : v.fg, fontWeight: '700', fontSize: small ? 13 : 15 }}>{title}</Text>
          </Row>
          {subtitle ? <Text style={{ color: v.fg, opacity: 0.8, fontSize: 11, marginTop: 2 }}>{subtitle}</Text> : null}
        </View>
      )}
    </Pressable>
  );
}

const buttonVariants: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary, fg: colors.white, border: colors.primary },
  secondary: { bg: colors.surface, fg: colors.text, border: colors.border },
  ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
  dark: { bg: colors.dark, fg: colors.white, border: colors.dark },
  light: { bg: colors.white, fg: colors.dark, border: colors.white },
  soft: { bg: colors.primarySoft, fg: colors.primaryDark, border: colors.primarySoft },
};

export function Chip({
  label,
  selected,
  onPress,
  tone = 'default',
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: 'default' | 'dark';
}) {
  const active = selected && tone === 'dark';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        selected && { backgroundColor: colors.primarySoft, borderColor: colors.primary },
        active && { backgroundColor: colors.dark, borderColor: colors.dark },
      ]}
    >
      <Text style={{ fontSize: 13, fontWeight: '600', color: active ? colors.white : selected ? colors.primaryDark : colors.text }}>
        {label}
      </Text>
    </Pressable>
  );
}

export type BadgeTone = 'green' | 'orange' | 'blue' | 'gray' | 'dark' | 'warn';
export function Badge({ text, tone = 'gray', style }: { text: string; tone?: BadgeTone; style?: StyleProp<ViewStyle> }) {
  const t = badgeTones[tone];
  return (
    <View style={[{ backgroundColor: t.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, alignSelf: 'flex-start' }, style]}>
      <Text style={{ color: t.fg, fontSize: 11, fontWeight: '600' }}>{text}</Text>
    </View>
  );
}
const badgeTones: Record<BadgeTone, { bg: string; fg: string }> = {
  green: { bg: colors.primarySoft, fg: colors.primaryDark },
  orange: { bg: colors.dangerSoft, fg: colors.danger },
  blue: { bg: colors.blueSoft, fg: colors.blue },
  gray: { bg: colors.surfaceMuted, fg: colors.muted },
  dark: { bg: colors.dark, fg: colors.white },
  warn: { bg: colors.warnSoft, fg: colors.warnText },
};

/** Nhãn phiên bản phát hành (R1.1 / R2) như trong bản mock */
export function ReleaseTag({ release }: { release: 'R1.1' | 'R2' }) {
  return <Badge text={release} tone="green" />;
}

export function ProgressBar({ value, color = colors.primary, height = 6, track = colors.surfaceMuted }: { value: number; color?: string; height?: number; track?: string }) {
  return (
    <View style={{ height, backgroundColor: track, borderRadius: height, overflow: 'hidden', flex: 1 }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height, backgroundColor: color, borderRadius: height }} />
    </View>
  );
}

export function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, marginTop: space.sm }}>
      {steps.map((s, i) => (
        <View key={s} style={{ flex: 1 }}>
          <View style={{ height: 4, borderRadius: 4, backgroundColor: i <= current ? colors.primary : colors.border }} />
          <Text style={{ fontSize: 11, marginTop: 4, color: i === current ? colors.text : colors.faint, fontWeight: i === current ? '700' : '400' }}>
            {i < current ? '✓ ' : ''}
            {s}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; hint?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={{ fontWeight: '700', fontSize: 14, color: active ? colors.text : colors.muted }}>{o.label}</Text>
            {o.hint ? <Text style={{ fontSize: 11, color: colors.faint }}>{o.hint}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dim';
export function OptionButton({
  letter,
  text,
  state = 'idle',
  tag,
  onPress,
  compact,
}: {
  letter?: string;
  text: string;
  state?: OptionState;
  tag?: string;
  onPress?: () => void;
  compact?: boolean;
}) {
  const s = optionStyles[state];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: state === 'selected' }}
      style={({ pressed }) => [
        styles.option,
        compact && { justifyContent: 'center', paddingVertical: 14 },
        { backgroundColor: s.bg, borderColor: s.border, borderWidth: state === 'idle' || state === 'dim' ? 1 : 1.5 },
        pressed && onPress && { opacity: 0.85 },
      ]}
    >
      {letter ? (
        <View style={[styles.optionLetter, { backgroundColor: s.letterBg }]}>
          <Text style={{ fontWeight: '700', color: s.letterFg, fontSize: 13 }}>{letter}</Text>
        </View>
      ) : null}
      <Text style={{ flex: compact ? 0 : 1, fontSize: 15, color: colors.text, fontWeight: compact ? '700' : '400' }}>{text}</Text>
      {tag ? <Text style={{ fontSize: 12, fontWeight: '700', color: s.tagFg }}>{tag}</Text> : null}
    </Pressable>
  );
}
const optionStyles: Record<OptionState, { bg: string; border: string; letterBg: string; letterFg: string; tagFg: string }> = {
  idle: { bg: colors.surface, border: colors.border, letterBg: colors.surfaceMuted, letterFg: colors.text, tagFg: colors.muted },
  dim: { bg: colors.surface, border: colors.border, letterBg: colors.surfaceMuted, letterFg: colors.faint, tagFg: colors.muted },
  selected: { bg: colors.blueSoft, border: colors.blue, letterBg: colors.blue, letterFg: colors.white, tagFg: colors.blue },
  correct: { bg: colors.primarySoft, border: colors.primary, letterBg: colors.primary, letterFg: colors.white, tagFg: colors.primaryDark },
  wrong: { bg: colors.dangerSoft, border: colors.danger, letterBg: colors.danger, letterFg: colors.white, tagFg: colors.danger },
};

export function ListRow({
  title,
  subtitle,
  icon,
  right,
  onPress,
  progress,
  last,
}: {
  title: string;
  subtitle?: string;
  icon?: IconName;
  right?: ReactNode;
  onPress?: () => void;
  progress?: number;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.listRow, !last && styles.listRowBorder, pressed && { opacity: 0.7 }]}
    >
      {icon ? (
        <View style={styles.listIcon}>
          <Feather name={icon} size={18} color={colors.primary} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>{title}</Text>
        {progress !== undefined ? (
          <Row>
            <View style={{ width: 70 }}>
              <ProgressBar value={progress} height={4} />
            </View>
            {subtitle ? <Text style={font.tiny}>{subtitle}</Text> : null}
          </Row>
        ) : subtitle ? (
          <Text style={font.small}>{subtitle}</Text>
        ) : null}
      </View>
      {right ?? (onPress ? <Feather name="chevron-right" size={18} color={colors.faint} /> : null)}
    </Pressable>
  );
}

export function SourceChip({ page, onPress }: { page: number; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.sourceChip} accessibilityRole="button" accessibilityLabel={`Mở trang ${page}`}>
      <Text style={{ color: colors.primaryDark, fontWeight: '700', fontSize: 13 }}>tr. {page}</Text>
    </Pressable>
  );
}

export function CitationMark({ n }: { n: number }) {
  return (
    <Text style={{ backgroundColor: colors.primarySoft, color: colors.primaryDark, fontSize: 12, fontWeight: '700', paddingHorizontal: 5, borderRadius: 4 }}>
      {` ${n} `}
    </Text>
  );
}

export function Stat({ value, label, color = colors.text, big }: { value: string | number; label: string; color?: string; big?: boolean }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ fontSize: big ? 30 : 24, fontWeight: '800', color }}>{value}</Text>
      <Text style={font.small}>{label}</Text>
    </View>
  );
}

export function Notice({ children, tone = 'warn', icon = 'alert-triangle' }: { children: ReactNode; tone?: 'warn' | 'green' | 'gray'; icon?: IconName }) {
  const bg = tone === 'warn' ? colors.warnSoft : tone === 'green' ? colors.primarySoft : colors.surfaceMuted;
  const fg = tone === 'warn' ? colors.warnText : tone === 'green' ? colors.primaryDark : colors.muted;
  return (
    <View style={{ backgroundColor: bg, borderRadius: radius.md, padding: space.md, flexDirection: 'row', gap: space.sm }}>
      <Feather name={icon} size={16} color={fg} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>{typeof children === 'string' ? <Text style={{ color: fg, fontSize: 13 }}>{children}</Text> : children}</View>
    </View>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: space.md }} />;
}

export function Spacer({ h = space.md }: { h?: number }) {
  return <View style={{ height: h }} />;
}

const styles = StyleSheet.create({
  contentWrap: { width: '100%', alignSelf: 'center' },
  footer: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  topBar: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: space.lg, paddingVertical: space.sm },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, borderWidth: 1, borderColor: colors.border },
  button: { minHeight: 48, borderRadius: radius.md, paddingHorizontal: space.lg, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  buttonSmall: { minHeight: 36, paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  segmented: { flexDirection: 'row', backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: 4 },
  segment: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: radius.sm },
  segmentActive: { backgroundColor: colors.surface, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.md, minHeight: 52 },
  optionLetter: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, minHeight: 52 },
  listRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  listIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  sourceChip: { backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.sm },
});
