import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Badge, Chip, ReleaseTag, Screen, Small, TopBar } from '../../components/ui';
import { flashcards as initial } from '../../data/mock';
import type { Flashcard } from '../../data/types';
import { colors, font, radius, space } from '../../theme';

type Filter = 'all' | 'due' | 'new' | 'hard' | 'suspended';

export default function BrowseCards() {
  const params = useLocalSearchParams<{ filter?: Filter }>();
  const [cards, setCards] = useState<Flashcard[]>(initial);
  const [filter, setFilter] = useState<Filter>(params.filter ?? 'all');
  const [q, setQ] = useState('');
  const [menuFor, setMenuFor] = useState<Flashcard | null>(null);

  const list = useMemo(
    () =>
      cards
        .filter((c) =>
          filter === 'due' ? c.dueToday : filter === 'new' ? c.state === 'new' : filter === 'hard' ? (c.lapses ?? 0) >= 3 : filter === 'suspended' ? c.suspended : true,
        )
        .filter((c) => c.front.toLowerCase().includes(q.toLowerCase())),
    [cards, filter, q],
  );

  const update = (id: string, patch: Partial<Flashcard>) => setCards((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <Screen header={<TopBar title="Duyệt thẻ" right={<ReleaseTag release="R1.1" />} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: space.lg }}>
        <Feather name="search" size={16} color={colors.faint} />
        <TextInput value={q} onChangeText={setQ} placeholder={`Tìm trong ${cards.length} thẻ…`} placeholderTextColor={colors.faint} style={{ flex: 1, minHeight: 46, fontSize: 15 }} accessibilityLabel="Tìm thẻ" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: space.md }} contentContainerStyle={{ gap: space.sm }}>
        {(
          [
            ['all', 'Tất cả'],
            ['due', 'Đến hạn'],
            ['new', 'Mới'],
            ['hard', 'Khó nhớ'],
            ['suspended', 'Tạm ẩn'],
          ] as [Filter, string][]
        ).map(([v, l]) => (
          <Chip key={v} label={l} tone="dark" selected={filter === v} onPress={() => setFilter(v)} />
        ))}
      </ScrollView>

      <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border }}>
        {list.length === 0 ? <Small style={{ padding: space.lg }}>Không có thẻ nào.</Small> : null}
        {list.map((c, i) => (
          <View key={c.id} style={{ flexDirection: 'row', padding: space.md, gap: space.sm, borderBottomWidth: i < list.length - 1 ? 1 : 0, borderBottomColor: colors.border, opacity: c.suspended ? 0.5 : 1 }}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', textDecorationLine: c.suspended ? 'line-through' : 'none' }}>{c.front}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                <Text style={font.tiny}>{c.topic} ·</Text>
                <Text style={[font.tiny, { color: c.dueToday ? colors.primary : c.state === 'new' ? colors.blue : colors.muted, fontWeight: '700' }]}>
                  {c.suspended ? 'Tạm ẩn' : c.dueLabel}
                </Text>
                <Badge text={c.origin} />
                {(c.lapses ?? 0) >= 3 ? <Badge text={`Khó nhớ · quên ${c.lapses} lần`} tone="warn" /> : null}
              </View>
            </View>
            <Pressable onPress={() => setMenuFor(c)} accessibilityLabel="Tuỳ chọn thẻ" hitSlop={8} style={{ padding: 6 }}>
              <Feather name="more-vertical" size={18} color={colors.muted} />
            </Pressable>
          </View>
        ))}
      </View>

      <Modal visible={!!menuFor} transparent animationType="fade" onRequestClose={() => setMenuFor(null)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }} onPress={() => setMenuFor(null)}>
          <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space.lg, paddingBottom: 40, gap: 4 }}>
            <Text style={[font.h3, { marginBottom: space.sm }]} numberOfLines={2}>
              {menuFor?.front}
            </Text>
            {[
              ['Ôn thẻ này ngay', () => router.push('/flashcards/review')],
              [menuFor?.suspended ? 'Bỏ tạm ẩn' : 'Tạm ẩn thẻ', () => menuFor && update(menuFor.id, { suspended: !menuFor.suspended })],
              ['Đặt lại thành thẻ mới', () => menuFor && update(menuFor.id, { state: 'new', dueLabel: 'Mới', dueToday: false })],
              ['Báo lỗi nội dung thẻ', () => router.push('/report')],
            ].map(([label, fn]) => (
              <Pressable
                key={label as string}
                onPress={() => {
                  (fn as () => void)();
                  setMenuFor(null);
                }}
                style={{ paddingVertical: space.md }}
              >
                <Text style={{ fontSize: 15 }}>{label as string}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}
