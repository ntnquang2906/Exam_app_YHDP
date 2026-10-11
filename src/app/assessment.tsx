import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Adapting } from '../components/Adapting';
import { HBar } from '../components/charts';
import { Badge, Body, Button, Card, H1, H2, H3, Label, OptionButton, Screen, Small, StepBar, TopBar, useAsync } from '../components/ui';
import { placementTest } from '../data/mock';
import type { Question } from '../data/types';
import { learningApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { colors, font, space } from '../theme';

type Phase = 'intro' | 'test' | 'adapting' | 'result';

/**
 * Bài đánh giá năng lực đầu vào → cá nhân hoá lộ trình.
 * Phần "ước lượng trình độ" ở đây chỉ tính tỷ lệ đúng theo miền
 * để minh hoạ; động cơ thích ứng thật nằm ở backend.
 */
export default function Assessment() {
  const questions = useAsync(() => learningApi.assessmentQuestions());
  const completeAssessment = useAppStore((s) => s.completeAssessment);
  const [phase, setPhase] = useState<Phase>('intro');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const mastery = useMemo(() => computeMastery(questions ?? [], answers), [questions, answers]);

  if (phase === 'intro') {
    return (
      <Screen header={<TopBar title="Bài đánh giá năng lực" />} footer={<Button style={{ flex: 1 }} title="Bắt đầu" onPress={() => setPhase('test')} />}>
        <H1>Đánh giá trình độ để cá nhân hoá lộ trình</H1>
        <Body style={{ marginTop: space.md, color: colors.muted }}>
          {placementTest.questionCount} câu · {placementTest.minutes} phút · phủ đều các miền năng lực. Kết quả dùng để xếp lộ trình, cập nhật bộ thẻ và chủ đề cần ôn. Không tính điểm.
        </Body>
        <Card style={{ marginTop: space.lg, gap: space.md }}>
          {[
            ['clock', 'Không giới hạn cứng — làm thoải mái, có thể dừng giữa chừng'],
            ['help-circle', 'Không biết thì chọn "Chưa học phần này" — đừng đoán'],
            ['git-branch', 'Câu sau được chọn dựa trên câu trước'],
          ].map(([icon, t]) => (
            <View key={t} style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
              <Feather name={icon as 'clock'} size={18} color={colors.primary} />
              <Body style={{ flex: 1 }}>{t}</Body>
            </View>
          ))}
        </Card>
      </Screen>
    );
  }

  if (phase === 'adapting') {
    return (
      <Adapting
        title="Gia sư đang xếp lộ trình cho bạn"
        subtitle={`Dựa trên ${Object.keys(answers).length} câu đánh giá bạn vừa làm`}
        steps={[
          { label: 'Chấm bài', result: `${mastery.correct}/${mastery.total} câu đúng` },
          { label: 'Ước lượng mức thành thạo', result: `${mastery.domains.length} miền` },
          { label: 'Tạo thẻ ôn từ câu sai', result: `+${mastery.total - mastery.correct} thẻ` },
          { label: 'Xếp lộ trình học', result: 'điểm yếu lên đầu' },
        ]}
        primaryLabel="Xem lộ trình của bạn"
        onPrimary={() => setPhase('result')}
      />
    );
  }

  if (phase === 'result') {
    return (
      <Screen
        footer={
          <Button
            style={{ flex: 1 }}
            title="Bắt đầu học theo lộ trình"
            onPress={() => {
              completeAssessment();
              router.replace('/home');
            }}
          />
        }
      >
        <Badge text="Kết quả đánh giá" tone="green" />
        <H1 style={{ marginTop: space.sm }}>
          {mastery.correct}/{mastery.total} câu đúng
        </H1>
        <Small>Lộ trình đã được xếp theo trình độ của bạn. Bạn có thể chỉnh lại bất cứ lúc nào.</Small>

        <Card style={{ marginTop: space.lg }}>
          <Label>Mức thành thạo theo miền</Label>
          <View style={{ marginTop: space.md }}>
            {mastery.domains.map((d) => (
              <HBar key={d.name} label={d.name} value={d.ratio} right={levelOf(d.ratio)} color={d.ratio < 0.5 ? colors.orange : colors.primary} />
            ))}
          </View>
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Label>Lộ trình đề xuất</Label>
          {pathFor(mastery.domains).map((p, i) => (
            <View key={p.title} style={{ flexDirection: 'row', gap: space.md, paddingVertical: space.md, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: colors.border }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: i === 0 ? colors.primary : colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: i === 0 ? colors.white : colors.text, fontWeight: '700' }}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <H3>{p.title}</H3>
                <Small>{p.detail}</Small>
              </View>
            </View>
          ))}
        </Card>
      </Screen>
    );
  }

  // phase === 'test'
  if (!questions) return <Screen><Small>Đang tải…</Small></Screen>;
  const q = questions[idx];
  const chosen = answers[q.id];
  const last = idx === questions.length - 1;
  return (
    <Screen
      header={
        <TopBar left="close" title="Bài đánh giá năng lực" subtitle={`Câu ${idx + 1}/${questions.length}`}>
          <StepBar steps={['Kiến thức nền', 'Áp dụng', 'Tình huống']} current={Math.min(2, Math.floor((idx / questions.length) * 3))} />
        </TopBar>
      }
      footer={
        <>
          <Button variant="secondary" title="Câu trước" disabled={idx === 0} onPress={() => setIdx(idx - 1)} />
          <Button
            style={{ flex: 1 }}
            title={last ? 'Nộp bài' : 'Câu tiếp'}
            disabled={!chosen}
            onPress={() => (last ? setPhase('adapting') : setIdx(idx + 1))}
          />
        </>
      }
    >
      <Text style={font.tiny}>{q.domain} · Mức {q.bloom}</Text>
      <H2 style={{ marginTop: space.sm, lineHeight: 28 }}>{q.stem}</H2>
      <View style={{ gap: space.sm, marginTop: space.lg }}>
        {q.options.map((o) => (
          <OptionButton key={o.id} letter={o.id} text={o.text} state={chosen === o.id ? 'selected' : 'idle'} onPress={() => setAnswers({ ...answers, [q.id]: o.id })} />
        ))}
        <OptionButton text="Chưa học phần này" state={chosen === 'skip' ? 'selected' : 'idle'} onPress={() => setAnswers({ ...answers, [q.id]: 'skip' })} />
      </View>
    </Screen>
  );
}

function computeMastery(qs: Question[], answers: Record<string, string>) {
  const by: Record<string, { c: number; t: number }> = {};
  let correct = 0;
  for (const q of qs) {
    if (!(q.id in answers)) continue;
    by[q.domain] ??= { c: 0, t: 0 };
    by[q.domain].t++;
    if (answers[q.id] === q.correctId) {
      by[q.domain].c++;
      correct++;
    }
  }
  const domains = Object.entries(by)
    .map(([name, v]) => ({ name, ratio: v.t ? v.c / v.t : 0 }))
    .sort((a, b) => a.ratio - b.ratio);
  return { correct, total: Object.keys(answers).length, domains };
}

function levelOf(r: number) {
  if (r >= 0.8) return 'Vững';
  if (r >= 0.5) return 'Đang tiến bộ';
  return 'Cần ưu tiên';
}

function pathFor(domains: { name: string; ratio: number }[]) {
  const weakest = domains[0]?.name ?? 'Dịch tễ học';
  return [
    { title: `Luyện điểm yếu: ${weakest}`, detail: '6 câu mỗi ngày, bám mức Vận dụng' },
    { title: 'Học tiếp: Dịch tễ học · Chủ đề 3', detail: 'Đo lường bệnh trạng · 3/8 bài' },
    { title: 'Ôn thẻ hằng ngày', detail: 'Khoảng 6 phút · thẻ tạo từ câu sai' },
    { title: 'Đề thi thử số 5', detail: 'Gợi ý sau 2 tuần, để đo tiến bộ' },
  ];
}
