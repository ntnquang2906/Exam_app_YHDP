import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Card, Label, ReleaseTag, Row, Screen, Small, TopBar } from '../../components/ui';
import { learner } from '../../data/mock';
import { useAppStore } from '../../store/useAppStore';
import { colors, radius, space } from '../../theme';

export default function ReviewSettings() {
  const { reviewSettings: s, updateReviewSettings: set, resetReviewSettings } = useAppStore();

  return (
    <Screen header={<TopBar title="Cài đặt ôn tập" right={<ReleaseTag release="R1.1" />} />}>
      <Label style={{ marginBottom: space.sm }}>Mỗi ngày</Label>
      <Card style={{ paddingVertical: space.sm }}>
        <Row style={{ justifyContent: 'space-between', paddingVertical: space.sm }}>
          <Text style={{ fontSize: 15 }}>Thẻ mới tối đa</Text>
          <Row>
            <Stepper icon="minus" label="Giảm" onPress={() => set({ newPerDay: Math.max(0, s.newPerDay - 5) })} />
            <Text style={{ width: 40, textAlign: 'center', fontWeight: '800', fontSize: 16 }}>{s.newPerDay}</Text>
            <Stepper icon="plus" label="Tăng" onPress={() => set({ newPerDay: Math.min(100, s.newPerDay + 5) })} />
          </Row>
        </Row>
        <View style={{ height: 1, backgroundColor: colors.border }} />
        <Row style={{ justifyContent: 'space-between', paddingVertical: space.md }}>
          <Text style={{ fontSize: 15 }}>Lượt ôn tối đa</Text>
          <Text style={{ fontWeight: '800', fontSize: 16 }}>{s.maxReviews}</Text>
        </Row>
      </Card>

      <Label style={{ marginTop: space.xl, marginBottom: space.sm }}>Mức nhớ mục tiêu</Label>
      <Card>
        <Row>
          {([0.85, 0.9, 0.95] as const).map((v) => {
            const on = s.targetRetention === v;
            return (
              <Pressable
                key={v}
                onPress={() => set({ targetRetention: v })}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                style={{ flex: 1, minHeight: 44, borderRadius: radius.md, borderWidth: 1, borderColor: on ? colors.dark : colors.border, backgroundColor: on ? colors.dark : colors.surface, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontWeight: '700', color: on ? colors.white : colors.text }}>{Math.round(v * 100)}%</Text>
              </Pressable>
            );
          })}
        </Row>
        <Small style={{ marginTop: space.sm }}>Cân bằng giữa số thẻ phải ôn và mức nhớ.</Small>
      </Card>

      <Label style={{ marginTop: space.xl, marginBottom: space.sm }}>Kỳ thi</Label>
      <Card style={{ paddingVertical: space.sm }}>
        <Row style={{ justifyContent: 'space-between', paddingVertical: space.md }}>
          <Text style={{ fontSize: 15 }}>Ngày thi</Text>
          <Text style={{ fontWeight: '800' }}>{learner.examDate.replace(/\//g, ' / ')}</Text>
        </Row>
        <View style={{ height: 1, backgroundColor: colors.border }} />
        <Check label="Dồn lịch ôn trước ngày thi" value={s.compressBeforeExam} onChange={(v) => set({ compressBeforeExam: v })} />
      </Card>

      <Label style={{ marginTop: space.xl, marginBottom: space.sm }}>Gia sư tạo thẻ từ kết quả</Label>
      <Card style={{ paddingVertical: space.sm }}>
        <Check label="Quiz trong học phần" value={s.sources.quiz} onChange={(v) => set({ sources: { ...s.sources, quiz: v } })} />
        <View style={{ height: 1, backgroundColor: colors.border }} />
        <Check label="Bài đánh giá năng lực" value={s.sources.assessment} onChange={(v) => set({ sources: { ...s.sources, assessment: v } })} />
        <View style={{ height: 1, backgroundColor: colors.border }} />
        <Check label="Đề thi thử" value={s.sources.exam} onChange={(v) => set({ sources: { ...s.sources, exam: v } })} />
      </Card>

      <Pressable onPress={resetReviewSettings} style={{ alignItems: 'center', padding: space.lg }}>
        <Text style={{ color: colors.primary, fontWeight: '700' }}>Khôi phục mặc định</Text>
      </Pressable>
    </Screen>
  );
}

function Stepper({ icon, label, onPress }: { icon: 'plus' | 'minus'; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} style={{ width: 40, height: 40, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
      <Feather name={icon} size={16} color={colors.text} />
    </Pressable>
  );
}

function Check({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onChange(!value)} accessibilityRole="checkbox" accessibilityState={{ checked: value }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.md, minHeight: 48 }}>
      <Text style={{ fontSize: 15, flex: 1 }}>{label}</Text>
      <View style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: value ? colors.primary : colors.surface, borderWidth: value ? 0 : 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
        {value ? <Feather name="check" size={16} color={colors.white} /> : null}
      </View>
    </Pressable>
  );
}
