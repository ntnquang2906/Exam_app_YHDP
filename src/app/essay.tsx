import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Badge, Body, Button, Card, IconButton, Label, ReleaseTag, Row, Screen, SourceChip, Small, TopBar } from '../components/ui';
import { colors, font, radius, space } from '../theme';

// Tự luận ngắn · gia sư chấm (R1.1). Câu không chắc chắn thì không tính vào mức thành thạo.
export default function Essay() {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [self, setSelf] = useState<'full' | 'missing' | null>(null);

  return (
    <Screen
      header={<TopBar left="close" title="Dịch tễ học cơ bản" subtitle="Chủ đề 3 · Đo lường bệnh trạng" right={<ReleaseTag release="R1.1" />} />}
      footer={
        <>
          <IconButton icon="message-circle" label="Hỏi gia sư" bordered onPress={() => router.push('/tutor')} />
          {submitted ? (
            <Button style={{ flex: 1 }} title="Tiếp tục" onPress={() => router.back()} />
          ) : (
            <Button style={{ flex: 1 }} title="Nộp câu trả lời" disabled={answer.trim().length < 5} onPress={() => setSubmitted(true)} />
          )}
        </>
      }
    >
      <Label style={{ color: colors.danger }}>Tự luận ngắn</Label>
      <Text style={[font.h2, { marginTop: space.sm, lineHeight: 28 }]}>
        Vì sao tỷ lệ hiện mắc của một bệnh mạn tính có thể tăng dù tỷ lệ mới mắc không đổi?
      </Text>

      {!submitted ? (
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          multiline
          placeholder="Viết câu trả lời ngắn của bạn…"
          placeholderTextColor={colors.faint}
          accessibilityLabel="Câu trả lời"
          style={{ marginTop: space.lg, minHeight: 140, textAlignVertical: 'top', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.md, fontSize: 15 }}
        />
      ) : (
        <View style={{ gap: space.md, marginTop: space.lg }}>
          <View style={{ backgroundColor: colors.surfaceMuted, borderRadius: radius.sm, padding: space.md }}>
            <Text style={font.small}>“{answer}” · Khá chắc</Text>
          </View>
          <Card style={{ gap: space.sm }}>
            <Badge text="Chưa chấm chắc chắn" tone="warn" />
            <Body>Gia sư chưa chắc câu trả lời đủ ý. Câu này không tính vào mức thành thạo.</Body>
            <Small>? Thời gian mắc bệnh kéo dài hơn</Small>
            <Small>? Người bệnh sống thêm nhưng chưa khỏi</Small>
            <Text style={[font.label, { marginTop: space.sm }]}>ĐÁP ÁN MẪU</Text>
            <View style={{ backgroundColor: colors.bg, borderRadius: radius.sm, padding: space.md }}>
              <Text style={font.serif}>
                Hiện mắc ≈ mới mắc × thời gian mắc bệnh trung bình. Khi điều trị giúp người bệnh sống lâu hơn nhưng chưa khỏi, thời gian mắc bệnh kéo dài nên tỷ lệ hiện mắc tăng.
              </Text>
            </View>
            <Text style={[font.small, { color: colors.text, marginTop: space.sm }]}>Tự đối chiếu với đáp án mẫu:</Text>
            <Row>
              <Button small variant={self === 'full' ? 'soft' : 'secondary'} title="Tôi đã đủ ý" onPress={() => setSelf('full')} style={{ flex: 1 }} />
              <Button small variant={self === 'missing' ? 'soft' : 'secondary'} title="Còn thiếu ý" onPress={() => setSelf('missing')} style={{ flex: 1 }} />
            </Row>
            <Row style={{ marginTop: space.sm, justifyContent: 'space-between' }}>
              <SourceChip page={61} onPress={() => router.push({ pathname: '/source', params: { doc: 'Giáo trình Dịch tễ học', page: '61' } })} />
              <IconButton icon="flag" label="Báo lỗi" onPress={() => router.push('/report')} />
            </Row>
          </Card>
        </View>
      )}
    </Screen>
  );
}
