import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Button, OptionButton, ProgressBar, Row, Screen, Small, useAsync } from '../../../components/ui';
import { examApi } from '../../../services/api';
import { useAppStore } from '../../../store/useAppStore';
import { colors, font, radius, space } from '../../../theme';
import { fmtTime, getExam } from '../../../lib/exam';

export default function TakeExam() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const exam = getExam(examId);
  const questions = useAsync(() => examApi.questions(examId), [examId]);
  const saveExam = useAppStore((s) => s.saveExam);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [left, setLeft] = useState(exam.minutes * 60);
  const [listOpen, setListOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const submitted = useRef(false);

  const submit = () => {
    if (submitted.current) return;
    submitted.current = true;
    saveExam(examId, answers, exam.minutes * 60 - left);
    router.replace(`/exam/${examId}/result`);
  };

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (left === 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  if (!questions) return <Screen><Small>Đang tải đề…</Small></Screen>;
  const q = questions[idx];
  const answeredCount = Object.keys(answers).length;

  return (
    <Screen
      header={
        <View style={{ backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, padding: space.md }}>
          <View style={{ maxWidth: 720, width: '100%', alignSelf: 'center', gap: space.sm }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View>
                <Text style={font.h3}>{exam.name}</Text>
                <Text style={{ fontSize: 11, color: colors.primary }}>✓ Đã lưu</Text>
              </View>
              <View style={{ backgroundColor: left < 300 ? colors.danger : colors.dark, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16, fontVariant: ['tabular-nums'] }}>{fmtTime(left)}</Text>
              </View>
              <Button small variant="secondary" title="Nộp bài" onPress={() => setConfirmOpen(true)} />
            </Row>
            <ProgressBar value={answeredCount / questions.length} />
          </View>
        </View>
      }
      footer={
        <>
          <Button variant="secondary" title="Câu trước" disabled={idx === 0} onPress={() => setIdx(idx - 1)} />
          <Button variant="secondary" title="Danh sách" onPress={() => setListOpen(true)} style={{ backgroundColor: colors.surfaceMuted }} />
          <Button style={{ flex: 1 }} title={idx === questions.length - 1 ? 'Nộp bài' : 'Câu sau'} onPress={() => (idx === questions.length - 1 ? setConfirmOpen(true) : setIdx(idx + 1))} />
        </>
      }
    >
      <Row style={{ justifyContent: 'space-between' }}>
        <Small>
          Câu {idx + 1} / {questions.length}
        </Small>
        <Pressable
          onPress={() => setFlags({ ...flags, [q.id]: !flags[q.id] })}
          accessibilityRole="button"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: flags[q.id] ? colors.orange : colors.border, backgroundColor: flags[q.id] ? colors.dangerSoft : colors.surface, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6 }}
        >
          <Feather name="flag" size={14} color={flags[q.id] ? colors.orange : colors.text} />
          <Text style={{ fontSize: 13 }}>{flags[q.id] ? 'Đã đánh dấu' : 'Đánh dấu'}</Text>
        </Pressable>
      </Row>
      <Text style={[font.h2, { marginTop: space.md, lineHeight: 28 }]}>{q.stem}</Text>
      <View style={{ gap: space.sm, marginTop: space.lg }}>
        {q.options.map((o) => (
          <OptionButton key={o.id} letter={o.id} text={o.text} state={answers[q.id] === o.id ? 'selected' : 'idle'} onPress={() => setAnswers({ ...answers, [q.id]: o.id })} />
        ))}
      </View>

      {/* Danh sách câu */}
      <Modal visible={listOpen} transparent animationType="slide" onRequestClose={() => setListOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setListOpen(false)} />
        <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space.lg, paddingBottom: 40, maxHeight: '70%' }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: space.md }}>
            <Text style={font.h3}>Danh sách câu</Text>
            <Small>
              Đã làm {answeredCount}/{questions.length}
            </Small>
          </Row>
          <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {questions.map((qq, i) => {
              const done = !!answers[qq.id];
              return (
                <Pressable
                  key={qq.id}
                  onPress={() => {
                    setIdx(i);
                    setListOpen(false);
                  }}
                  style={{ width: 48, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? colors.primarySoft : colors.surfaceMuted, borderWidth: i === idx ? 2 : flags[qq.id] ? 1.5 : 0, borderColor: i === idx ? colors.dark : colors.orange }}
                >
                  <Text style={{ fontWeight: '700', color: done ? colors.primaryDark : colors.text }}>{i + 1}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Small style={{ marginTop: space.md }}>Xanh: đã trả lời · Viền cam: đã đánh dấu</Small>
        </View>
      </Modal>

      {/* Xác nhận nộp */}
      <Modal visible={confirmOpen} transparent animationType="fade" onRequestClose={() => setConfirmOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: space.xl }}>
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.xl, width: '100%', maxWidth: 400, gap: space.md }}>
            <Text style={font.h2}>Nộp bài?</Text>
            <Small>
              Bạn đã trả lời {answeredCount}/{questions.length} câu
              {Object.values(flags).filter(Boolean).length ? ` · ${Object.values(flags).filter(Boolean).length} câu đang đánh dấu` : ''}. Sau khi nộp không sửa được.
            </Small>
            <Row>
              <Button variant="secondary" title="Làm tiếp" onPress={() => setConfirmOpen(false)} style={{ flex: 1 }} />
              <Button title="Nộp bài" onPress={submit} style={{ flex: 1 }} />
            </Row>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
