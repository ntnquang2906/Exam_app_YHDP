import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Button, Card, IconButton, Row, Screen, Small, TopBar } from '../../components/ui';
import { decks } from '../../data/mock';
import type { Deck } from '../../data/types';
import { colors, font, space } from '../../theme';

export default function Decks() {
  const [open, setOpen] = useState<Record<string, boolean>>({ 'dich-te': true });
  return (
    <Screen header={<TopBar title="Bộ thẻ" right={<IconButton icon="search" label="Tìm thẻ" onPress={() => router.push('/flashcards/browse')} />} />}>
      <Card style={{ gap: space.md }}>
        <Text style={font.label}>HÔM NAY</Text>
        <Row gap={space.xl}>
          <Count value={2} label="Mới" color={colors.blue} />
          <Count value={2} label="Đang học" color={colors.orange} />
          <Count value={8} label="Đến hạn" color={colors.primary} />
        </Row>
        <Small>Gia sư vừa thêm 5 thẻ từ câu bạn sai tuần này</Small>
        <Button title="Ôn 12 thẻ · khoảng 6 phút" onPress={() => router.push('/flashcards/review')} />
      </Card>

      <Card style={{ marginTop: space.md, padding: 0 }}>
        <Row style={{ paddingHorizontal: space.lg, paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={[font.tiny, { flex: 1 }]}>Bộ thẻ</Text>
          <Text style={[font.tiny, { width: 40, textAlign: 'center', color: colors.blue }]}>Mới</Text>
          <Text style={[font.tiny, { width: 40, textAlign: 'center', color: colors.orange }]}>Học</Text>
          <Text style={[font.tiny, { width: 40, textAlign: 'center', color: colors.primary }]}>Ôn</Text>
        </Row>
        {decks.map((d) => (
          <View key={d.id}>
            <DeckRow
              deck={d}
              bold
              expandable={!!d.children}
              open={open[d.id]}
              onToggle={() => setOpen({ ...open, [d.id]: !open[d.id] })}
              onPress={() => router.push('/topic/dt-3')}
              subtitle={d.id === 'hard' ? 'Tự gom từ thẻ hay quên' : undefined}
            />
            {open[d.id] && d.children?.map((c) => <DeckRow key={c.id} deck={c} indent onPress={() => router.push(`/topic/${c.id}`)} />)}
          </View>
        ))}
      </Card>

      <Row style={{ marginTop: space.md }}>
        <Button small variant="secondary" icon="list" title="Duyệt thẻ" onPress={() => router.push('/flashcards/browse')} style={{ flex: 1 }} />
        <Button small variant="secondary" icon="settings" title="Cài đặt ôn tập" onPress={() => router.push('/flashcards/settings')} style={{ flex: 1 }} />
      </Row>
    </Screen>
  );
}

function Count({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View>
      <Text style={{ fontSize: 26, fontWeight: '800', color }}>{value}</Text>
      <Small>{label}</Small>
    </View>
  );
}

function DeckRow({
  deck,
  bold,
  indent,
  expandable,
  open,
  onToggle,
  onPress,
  subtitle,
}: {
  deck: Deck;
  bold?: boolean;
  indent?: boolean;
  expandable?: boolean;
  open?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  subtitle?: string;
}) {
  const num = (v: number, color: string) => (
    <Text style={{ width: 40, textAlign: 'center', fontWeight: '700', color: v === 0 ? colors.faint : color }}>{v}</Text>
  );
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.lg, paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.border, minHeight: 52 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: indent ? space.xl : 0 }}>
        {expandable ? (
          <Pressable onPress={onToggle} hitSlop={10} accessibilityLabel={open ? 'Thu gọn' : 'Mở rộng'}>
            <Feather name={open ? 'chevron-down' : 'chevron-right'} size={16} color={colors.muted} />
          </Pressable>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: indent ? 14 : 15, fontWeight: bold ? '700' : '400' }}>{deck.name}</Text>
          {subtitle ? <Text style={font.tiny}>{subtitle}</Text> : null}
        </View>
      </View>
      {num(deck.newCount, colors.blue)}
      {num(deck.learning, colors.orange)}
      {num(deck.due, colors.primary)}
    </Pressable>
  );
}
