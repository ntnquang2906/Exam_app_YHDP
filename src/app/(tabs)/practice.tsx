import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Card, Chip, ProgressBar, Row, Screen } from '../../components/ui';
import { modules } from '../../data/mock';
import { useAppStore } from '../../store/useAppStore';
import { colors, font, radius, space } from '../../theme';

type Filter = 'all' | 'learning' | 'new';

export default function Practice() {
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [facet, setFacet] = useState<string | null>(null);
  const selected = useAppStore((s) => s.selectedModules);

  const list = useMemo(
    () =>
      modules
        .filter((m) => (filter === 'learning' ? m.progress > 0 : filter === 'new' ? m.progress === 0 : true))
        .filter((m) => m.name.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => Number(selected.includes(b.id)) - Number(selected.includes(a.id))),
    [filter, q, selected],
  );

  return (
    <Screen>
      <Text style={font.h1}>Luyện tập</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: space.lg }}>
        <Feather name="search" size={16} color={colors.faint} />
        <TextInput value={q} onChangeText={setQ} placeholder="Tìm học phần, chủ đề…" placeholderTextColor={colors.faint} style={{ flex: 1, minHeight: 46, fontSize: 15 }} accessibilityLabel="Tìm học phần" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: space.md }} contentContainerStyle={{ gap: space.sm }}>
        {['Miền năng lực', 'Vấn đề cốt lõi', 'Mức nhận thức', 'Độ khó'].map((f) => (
          <Pressable key={f} onPress={() => setFacet(facet === f ? null : f)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: facet === f ? colors.primary : colors.border, backgroundColor: colors.surface, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 8 }}>
            <Text style={{ fontSize: 13 }}>{f}</Text>
            <Feather name="chevron-down" size={14} color={colors.muted} />
          </Pressable>
        ))}
      </ScrollView>
      {facet ? (
        <Card style={{ marginTop: space.sm, padding: space.md }}>
          <Text style={font.small}>Bộ lọc “{facet}” sẽ lấy danh mục từ ngân hàng câu hỏi khi nối backend.</Text>
        </Card>
      ) : null}

      <Row style={{ marginTop: space.md }}>
        <Chip label="Tất cả" tone="dark" selected={filter === 'all'} onPress={() => setFilter('all')} />
        <Chip label="Đang học" tone="dark" selected={filter === 'learning'} onPress={() => setFilter('learning')} />
        <Chip label="Chưa học" tone="dark" selected={filter === 'new'} onPress={() => setFilter('new')} />
      </Row>

      <Pressable onPress={() => router.push('/flashcards')} style={{ marginTop: space.md, backgroundColor: colors.dark, borderRadius: radius.lg, padding: space.lg, flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.darkSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="layers" size={18} color={colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>Thẻ ôn</Text>
          <Text style={{ color: '#9FB1A7', fontSize: 12 }}>12 thẻ đến hạn hôm nay · 104 thẻ trong 2 học phần</Text>
        </View>
        <Feather name="chevron-right" size={18} color="#9FB1A7" />
      </Pressable>

      <Text style={[font.label, { marginTop: space.xl, marginBottom: space.sm }]}>HỌC PHẦN</Text>
      <View style={{ gap: space.sm }}>
        {list.map((m) => (
          <Card key={m.id} onPress={() => router.push(`/module/${m.id}`)} style={{ padding: space.md, gap: space.sm }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '700', fontSize: 15, color: colors.text }}>{m.name}</Text>
              <Text style={font.tiny}>{m.topicCount} chủ đề</Text>
            </Row>
            <Row>
              <ProgressBar value={m.progress} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: m.progress > 0 ? colors.primary : colors.muted, width: 64, textAlign: 'right' }}>
                {m.progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
              </Text>
            </Row>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
