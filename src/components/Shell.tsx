import { Feather } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, space } from '../theme';
import { useIsWide } from './ui';

export interface NavItem {
  href: string;
  label: string;
  badge?: string;
}

/**
 * Khung trang quản trị (chuyên gia, cấp Bộ): sidebar tối trên máy tính,
 * thanh cuộn ngang trên điện thoại.
 */
export function Shell({
  title,
  subtitle,
  nav,
  user,
  children,
}: {
  title: string;
  subtitle: string;
  nav: NavItem[];
  user: { name: string; role: string };
  children: ReactNode;
}) {
  const wide = useIsWide();
  const pathname = usePathname();
  const signOut = useAppStore((s) => s.signOut);
  const isActive = (href: string) => pathname === href || (href.split('/').length > 2 && pathname.startsWith(href));
  const logout = () => {
    signOut();
    router.replace('/login');
  };

  const navList = nav.map((n) => {
    const active = isActive(n.href);
    return (
      <Pressable
        key={n.href}
        onPress={() => router.navigate(n.href as never)}
        accessibilityRole="link"
        accessibilityState={{ selected: active }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: space.md,
          paddingVertical: 10,
          borderRadius: radius.sm,
          backgroundColor: active ? colors.darkSoft : 'transparent',
          minHeight: 40,
        }}
      >
        <Text style={{ color: active ? colors.white : '#C9D6CF', fontSize: 14, fontWeight: active ? '700' : '400' }}>{n.label}</Text>
        {n.badge ? (
          <View style={{ backgroundColor: active ? colors.primary : 'transparent', paddingHorizontal: 8, borderRadius: radius.pill, marginLeft: 8 }}>
            <Text style={{ color: colors.white, fontSize: 12, fontWeight: '700' }}>{n.badge}</Text>
          </View>
        ) : null}
      </Pressable>
    );
  });

  if (!wide) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
        <View style={{ backgroundColor: colors.dark, paddingTop: space.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg }}>
            <View>
              <Text style={{ color: colors.white, fontWeight: '800' }}>{title}</Text>
              <Text style={{ color: '#9FB1A7', fontSize: 11 }}>{subtitle}</Text>
            </View>
            <Pressable onPress={logout} accessibilityLabel="Đăng xuất" style={{ padding: 8 }}>
              <Feather name="log-out" size={18} color="#C9D6CF" />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: space.sm, gap: 4 }}>
            {navList}
          </ScrollView>
        </View>
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 48 }}>{children}</ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ width: 232, backgroundColor: colors.dark, padding: space.md }}>
        <View style={{ padding: space.sm, marginBottom: space.lg }}>
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 15 }}>{title}</Text>
          <Text style={{ color: '#9FB1A7', fontSize: 11, marginTop: 2 }}>{subtitle}</Text>
        </View>
        <View style={{ gap: 2 }}>{navList}</View>
        <View style={{ flex: 1 }} />
        <Pressable onPress={logout} style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.sm }} accessibilityLabel="Đăng xuất">
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.darkSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.white, fontSize: 12, fontWeight: '700' }}>
              {user.name
                .split(' ')
                .slice(-2)
                .map((w) => w[0])
                .join('')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.white, fontSize: 13 }}>{user.name}</Text>
            <Text style={{ color: '#9FB1A7', fontSize: 11 }}>{user.role}</Text>
          </View>
          <Feather name="log-out" size={16} color="#9FB1A7" />
        </Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: space.xl, paddingBottom: 64 }}>
        <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center' }}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function PageHeader({ title, badge, subtitle, actions }: { title: string; badge?: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md, alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: space.lg }}>
      <View style={{ flexShrink: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' }}>
          <Text style={font.h1}>{title}</Text>
          {badge ? (
            <View style={{ backgroundColor: colors.warnSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill }}>
              <Text style={{ color: colors.warnText, fontSize: 11, fontWeight: '700' }}>{badge}</Text>
            </View>
          ) : null}
        </View>
        {subtitle ? <Text style={[font.small, { marginTop: 4 }]}>{subtitle}</Text> : null}
      </View>
      {actions ? <View style={{ flexDirection: 'row', gap: space.sm }}>{actions}</View> : null}
    </View>
  );
}

/** Bảng đơn giản, cuộn ngang khi hẹp */
export function Table({ headers, rows, widths }: { headers: string[]; rows: (string | ReactNode)[][]; widths?: number[] }) {
  const w = (i: number) => widths?.[i] ?? 120;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: space.sm }}>
          {headers.map((h, i) => (
            <Text key={h} style={[font.tiny, { width: w(i), paddingHorizontal: 6, fontWeight: '700' }]}>
              {h}
            </Text>
          ))}
        </View>
        {rows.map((r, ri) => (
          <View key={ri} style={{ flexDirection: 'row', borderBottomWidth: ri < rows.length - 1 ? 1 : 0, borderBottomColor: colors.border, paddingVertical: 10, alignItems: 'center' }}>
            {r.map((c, ci) => (
              <View key={ci} style={{ width: w(ci), paddingHorizontal: 6 }}>
                {typeof c === 'string' || typeof c === 'number' ? <Text style={{ fontSize: 13, color: colors.text, fontWeight: ci === 0 ? '700' : '400' }}>{c}</Text> : c}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function FilterBar({ items }: { items: [string, string][] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.sm, marginBottom: space.lg }}>
      {items.map(([k, v]) => (
        <Pressable key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={font.tiny}>{k}:</Text>
          <Text style={{ fontSize: 13, fontWeight: '700' }}>{v}</Text>
          <Feather name="chevron-down" size={12} color={colors.muted} />
        </Pressable>
      ))}
    </View>
  );
}

export function Kpi({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.lg, gap: 4, flexGrow: 1, flexBasis: 200 }}>
      <Text style={font.tiny}>{label}</Text>
      <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text }}>{value}</Text>
      {note ? <Text style={font.tiny}>{note}</Text> : null}
    </View>
  );
}
