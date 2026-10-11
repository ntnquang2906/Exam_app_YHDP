import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Body, Button, Card, IconButton, OptionButton, OptionState, Row, Screen, SourceChip, TopBar, useAsync } from '../../../components/ui';
import { sampleAnswers } from '../../../lib/exam';
import { examApi } from '../../../services/api';
import { useAppStore } from '../../../store/useAppStore';
import { colors, font, space } from '../../../theme';

// Xem lại đáp án: mặc định nhảy giữa các câu sai
export default function ExamReview() {
  const { examId, i } = useLocalSearchParams<{ examId: string; i?: string }>();
  const questions = useAsync(() => examApi.questions(examId), [examId]) ?? [];
  const lastExam = useAppStore((s) => s.lastExam);
  const answers = useMemo(() => (lastExam?.examId === examId ? lastExam.answers : sampleAnswers(questions)), [lastExam, examId, questions]);
  const wrongIdx = questions.map((q, k) => (answers[q.id] !== q.correctId ? k : -1)).filter((k) => k >= 0);
  const [idx, setIdx] = useState<number | null>(i !== undefined ? Number(i) : null);
  const current = idx ?? wrongIdx[0] ?? 0;
  const q = questions[current];
  if (!q) return <Screen><Text>Đang tải…</Text></Screen>;

  const a = answers[q.id];
  const prevWrong = [...wrongIdx].reverse().find((k) => k < current);
  const nextWrong = wrongIdx.find((k) => k > current);
  const stateOf = (id: string): OptionState => (id === q.correctId ? 'correct' : id === a ? 'wrong' : 'idle');
  const tagOf = (id: string) => (id === q.correctId ? '✓ Đáp án' : id === a ? '✕ Bạn chọn' : undefined);

  return (
    <Screen
      header={<TopBar title={`Câu ${current + 1} / ${questions.length}`} right={<Text style={font.tiny}>{q.domain}</Text>} />}
      footer={
        <>
          <Button variant="secondary" title="Câu sai trước" disabled={prevWrong === undefined} onPress={() => setIdx(prevWrong!)} style={{ flex: 1 }} />
          <Button title="Câu sai tiếp" disabled={nextWrong === undefined} onPress={() => setIdx(nextWrong!)} style={{ flex: 1 }} />
        </>
      }
    >
      <Text style={[font.h2, { lineHeight: 28 }]}>{q.stem}</Text>
      {!a ? <Text style={{ color: colors.warnText, marginTop: space.sm }}>Bạn đã bỏ trống câu này.</Text> : null}
      <View style={{ gap: space.sm, marginTop: space.lg }}>
        {q.options.map((o) => (
          <OptionButton key={o.id} letter={o.id} text={o.text} state={stateOf(o.id)} tag={tagOf(o.id)} />
        ))}
      </View>
      <Card style={{ marginTop: space.md, gap: space.sm }}>
        <Text style={font.label}>GIẢI THÍCH CỦA CHUYÊN GIA</Text>
        <Body>{q.explanation}</Body>
        <Row style={{ marginTop: space.xs }}>
          <Button small variant="secondary" title="Giải thích thêm" onPress={() => router.push({ pathname: '/tutor', params: { q: q.id, chosen: a ?? '' } })} />
          <SourceChip page={q.source.page} onPress={() => router.push({ pathname: '/source', params: { doc: q.source.doc, page: String(q.source.page) } })} />
          <View style={{ flex: 1 }} />
          <IconButton icon="flag" label="Báo lỗi" onPress={() => router.push({ pathname: '/report', params: { q: q.id } })} />
        </Row>
      </Card>
    </Screen>
  );
}
