import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, IconButton, Notice, OptionButton, ReleaseTag, Screen, TopBar } from '../components/ui';
import { questions } from '../data/mock';
import { colors, font, space } from '../theme';

// Câu hỏi do AI hỗ trợ tạo (R2): chưa qua chuyên gia, không tính vào đánh giá
export default function AiQuestion() {
  const q = questions.find((x) => x.aiAssisted)!;
  const [chosen, setChosen] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  return (
    <Screen
      header={<TopBar left="close" title="Dịch tễ học cơ bản" subtitle="Chủ đề 3 · Đo lường bệnh trạng" right={<ReleaseTag release="R2" />} />}
      footer={
        <>
          <IconButton icon="message-circle" label="Hỏi gia sư" bordered onPress={() => router.push({ pathname: '/tutor', params: { q: q.id } })} />
          <Button variant="secondary" title="Bỏ qua" onPress={() => router.back()} />
          {checked ? (
            <Button style={{ flex: 1 }} title="Tiếp tục" onPress={() => router.back()} />
          ) : (
            <Button style={{ flex: 1 }} title="Kiểm tra" disabled={!chosen} onPress={() => setChecked(true)} />
          )}
        </>
      }
    >
      <Notice>
        <Text style={{ color: colors.warnText, fontWeight: '700' }}>Câu do AI hỗ trợ tạo</Text>
        <Text style={{ color: colors.warnText, fontSize: 13 }}>Chưa thẩm định chuyên gia · không tính vào đánh giá</Text>
      </Notice>
      <Text style={[font.h2, { marginTop: space.lg, lineHeight: 28 }]}>{q.stem}</Text>
      <Card style={{ marginTop: space.md, gap: 6 }}>
        <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>
          Nguồn · {q.source.doc}, tr. {q.source.page}
        </Text>
        <Text style={font.serif}>
          […] <Text style={{ backgroundColor: colors.primarySoft }}>{q.source.excerpt}</Text> […]
        </Text>
      </Card>
      <View style={{ gap: space.sm, marginTop: space.md }}>
        {q.options.map((o) => (
          <OptionButton
            key={o.id}
            letter={o.id}
            text={o.text}
            state={checked ? (o.id === q.correctId ? 'correct' : o.id === chosen ? 'wrong' : 'dim') : chosen === o.id ? 'selected' : 'idle'}
            onPress={checked ? undefined : () => setChosen(o.id)}
          />
        ))}
      </View>
      <Button small variant="secondary" icon="flag" title="Báo lỗi câu này" onPress={() => router.push({ pathname: '/report', params: { q: q.id } })} style={{ alignSelf: 'flex-start', marginTop: space.md }} />
    </Screen>
  );
}
