import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, space } from '../theme';

export interface AdaptStep {
  label: string;
  result: string;
}

/** Màn "Gia sư đang điều chỉnh lộ trình" — hiệu ứng từng bước hoàn thành. */
export function Adapting({
  title = 'Gia sư đang điều chỉnh lộ trình của bạn',
  subtitle,
  steps,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  title?: string;
  subtitle: string;
  steps: AdaptStep[];
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (done >= steps.length) return;
    const t = setTimeout(() => setDone((d) => d + 1), 550);
    return () => clearTimeout(t);
  }, [done, steps.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark }}>
      <View style={{ flex: 1, maxWidth: 520, width: '100%', alignSelf: 'center', padding: space.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable onPress={() => setDone(0)}>
            <Text style={{ color: '#9FB1A7', fontSize: 13 }}>Phát lại hiệu ứng</Text>
          </Pressable>
          <Pressable onPress={() => setDone(steps.length)}>
            <Text style={{ color: colors.primaryMid, fontSize: 13, fontWeight: '700' }}>Bỏ qua</Text>
          </Pressable>
        </View>
        <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: colors.darkSoft, alignItems: 'center', justifyContent: 'center', marginTop: space.xxl }}>
          <Feather name="star" size={28} color="#D9B26A" />
        </View>
        <Text style={{ color: colors.white, fontSize: 26, fontWeight: '800', marginTop: space.lg, lineHeight: 34 }}>{title}</Text>
        <Text style={{ color: '#9FB1A7', marginTop: space.sm }}>{subtitle}</Text>
        <View style={{ height: 4, backgroundColor: colors.darkSoft, borderRadius: 4, marginTop: space.xl, overflow: 'hidden' }}>
          <View style={{ height: 4, width: `${(done / steps.length) * 100}%`, backgroundColor: colors.primaryMid }} />
        </View>
        <View style={{ marginTop: space.lg }}>
          {steps.map((s, i) => {
            const ok = i < done;
            return (
              <View key={s.label} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.darkSoft, opacity: ok ? 1 : 0.4 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: ok ? colors.primary : colors.darkSoft, alignItems: 'center', justifyContent: 'center' }}>
                  {ok ? <Feather name="check" size={14} color={colors.white} /> : null}
                </View>
                <Text style={{ color: colors.white, flex: 1, fontSize: 15 }}>{s.label}</Text>
                <Text style={{ color: colors.primaryMid, fontSize: 13, fontWeight: '600' }}>{ok ? s.result : ''}</Text>
              </View>
            );
          })}
        </View>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={onPrimary}
          disabled={done < steps.length}
          style={{ backgroundColor: colors.white, borderRadius: radius.md, minHeight: 52, alignItems: 'center', justifyContent: 'center', opacity: done < steps.length ? 0.5 : 1 }}
        >
          <Text style={{ fontWeight: '800', color: colors.dark, fontSize: 15 }}>{primaryLabel}</Text>
        </Pressable>
        {secondaryLabel ? (
          <Pressable onPress={onSecondary} style={{ padding: space.md, alignItems: 'center' }}>
            <Text style={{ color: '#9FB1A7' }}>{secondaryLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
