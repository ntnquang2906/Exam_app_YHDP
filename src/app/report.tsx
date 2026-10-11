import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button, Chip, Notice, Screen, TopBar } from '../components/ui';
import { colors, font, radius, space } from '../theme';

const REASONS = ['Đáp án sai', 'Giải thích chưa đúng', 'Trích dẫn không khớp', 'Đề bài thiếu dữ kiện', 'Khác'];

// Báo lỗi nội dung → vào hàng đợi "Báo lỗi từ học viên" của chuyên gia
export default function Report() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <Screen
      header={<TopBar left="close" title="Báo lỗi nội dung" subtitle={q ? `Mã: ${q}` : undefined} />}
      footer={sent ? <Button style={{ flex: 1 }} title="Đóng" onPress={() => router.back()} /> : <Button style={{ flex: 1 }} title="Gửi báo lỗi" disabled={!reason} onPress={() => setSent(true)} />}
    >
      {sent ? (
        <Notice tone="green" icon="check-circle">
          Cảm ơn bạn. Báo lỗi đã được chuyển tới chuyên gia kiểm duyệt.
        </Notice>
      ) : (
        <>
          <Text style={font.h3}>Vấn đề là gì?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.md }}>
            {REASONS.map((r) => (
              <Chip key={r} label={r} selected={reason === r} onPress={() => setReason(r)} />
            ))}
          </View>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            placeholder="Mô tả thêm (không bắt buộc)"
            placeholderTextColor={colors.faint}
            accessibilityLabel="Mô tả lỗi"
            style={{ marginTop: space.lg, minHeight: 110, textAlignVertical: 'top', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.md, fontSize: 15 }}
          />
        </>
      )}
    </Screen>
  );
}
