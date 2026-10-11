import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, Chip, Row, Screen, Small, TopBar, useAsync } from '../../../components/ui';
import { fmtTime, getExam, sampleAnswers, score } from '../../../lib/exam';
import { examApi } from '../../../services/api';
import { useAppStore } from '../../../store/useAppStore';
import { colors, font, radius, space } from '../../../theme';

type Filter = 'all' | 'wrong' | 'blank' | 'right';

export default function ExamResult() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const exam = getExam(examId);
  const questions = useAsync(() => examApi.questions(examId), [examId]) ?? [];
  const lastExam = useAppStore((s) => s.lastExam);
  const [filter, setFilter] = useState<Filter>('all');

  const answers = useMemo(
    () => (lastExam?.examId === examId ? lastExam.answers : sampleAnswers(questions)),
    [lastExam, examId, questions],
  );
  const seconds = lastExam?.examId === examId ? lastExam.seconds : 48 * 60;
  const s = score(questions, answers);

  const rows = questions
    .map((q, i) => ({ q, i, a: answers[q.id] }))
    .filter(({ q, a }) => (filter === 'wrong' ? a && a !== q.correctId : filter === 'blank' ? !a : filter === 'right' ? a === q.correctId : true));

  return (
    <Screen header={<TopBar title={`Kết quả · ${exam.name}`} onLeft={() => router.replace('/exams')} />}>
      <Card>
        <Text>
          <Text style={{ fontSize: 44, fontWeight: '800' }}>{s.correct}</Text>
          <Text style={font.small}> / {questions.length} câu đúng</Text>
        </Text>
        <Row gap={space.sm} style={{ marginTop: space.md }}>
          <Mini label="Sai" value={String(s.wrong)} />
          <Mini label="Bỏ trống" value={String(s.blank)} />
          <Mini label="Thời gian" value={`${Math.round(seconds / 60)} phút`} title={fmtTime(seconds)} />
        </Row>
      </Card>

      <View style={{ backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: space.lg, marginTop: space.md, gap: space.sm }}>
        <Text style={[font.label, { color: colors.primaryDark }]}>ĐÃ CẬP NHẬT ÔN TẬP</Text>
        <Pressable onPress={() => router.push('/flashcards')} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
          <Text>
            <Text style={{ fontWeight: '800' }}>+{s.wrong} thẻ</Text> gia sư tạo từ câu sai
          </Text>
          <Feather name="chevron-right" size={16} color={colors.primaryDark} />
        </Pressable>
        <Pressable onPress={() => router.push('/progress')} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
          <Text>
            Ưu tiên ôn: <Text style={{ fontWeight: '800' }}>Dịch tễ học, Tiêm chủng</Text>
          </Text>
          <Feather name="chevron-right" size={16} color={colors.primaryDark} />
        </Pressable>
      </View>

      <Row style={{ marginTop: space.lg }}>
        {(
          [
            ['all', 'Tất cả'],
            ['wrong', 'Sai'],
            ['blank', 'Bỏ trống'],
            ['right', 'Đúng'],
          ] as [Filter, string][]
        ).map(([v, l]) => (
          <Chip key={v} label={l} tone="dark" selected={filter === v} onPress={() => setFilter(v)} />
        ))}
      </Row>

      <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginTop: space.md }}>
        {rows.map(({ q, i, a }, k) => {
          const ok = a === q.correctId;
          return (
            <Pressable
              key={q.id}
              onPress={() => router.push(`/exam/${examId}/review?i=${i}`)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderBottomWidth: k < rows.length - 1 ? 1 : 0, borderBottomColor: colors.border }}
            >
              <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: !a ? colors.surfaceMuted : ok ? colors.primarySoft : colors.dangerSoft }}>
                <Feather name={!a ? 'minus' : ok ? 'check' : 'x'} size={14} color={!a ? colors.muted : ok ? colors.primary : colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600' }}>Câu {i + 1}</Text>
                <Text style={font.tiny}>{q.domain}</Text>
              </View>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Xem lại</Text>
            </Pressable>
          );
        })}
        {rows.length === 0 ? <Small style={{ padding: space.lg }}>Không có câu nào.</Small> : null}
      </View>
    </Screen>
  );
}

function Mini({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, borderRadius: radius.sm, padding: space.sm }} accessibilityLabel={title}>
      <Text style={font.tiny}>{label}</Text>
      <Text style={{ fontWeight: '800', fontSize: 16 }}>{value}</Text>
    </View>
  );
}
