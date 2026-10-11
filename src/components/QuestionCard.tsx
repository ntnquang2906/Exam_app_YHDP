import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Question } from '../data/types';
import { colors, font, radius, space } from '../theme';
import { Body, Button, Card, H3, IconButton, OptionButton, OptionState, Row, SourceChip } from './ui';

/**
 * Hiển thị một câu trắc nghiệm. Chọn đáp án là chấm ngay (chế độ luyện tập).
 * Dùng `key={question.id}` ở nơi gọi để reset khi đổi câu.
 */
export function QuestionCard({
  question,
  onAnswered,
  showWhy,
  grid,
  onFlag,
}: {
  question: Question;
  onAnswered?: (correct: boolean, chosen: string) => void;
  showWhy?: boolean;
  grid?: boolean;
  onFlag?: () => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const answered = chosen !== null;
  const correct = chosen === question.correctId;

  const pick = (id: string) => {
    if (answered) return;
    setChosen(id);
    onAnswered?.(id === question.correctId, id);
  };

  const stateOf = (id: string): OptionState => {
    if (!answered) return 'idle';
    if (id === question.correctId) return 'correct';
    if (id === chosen) return 'wrong';
    return 'dim';
  };
  const tagOf = (id: string) => {
    if (!answered) return undefined;
    if (id === question.correctId) return grid ? '✓' : 'Đúng';
    if (id === chosen) return grid ? '✕' : 'Bạn chọn';
    return undefined;
  };

  return (
    <View style={{ gap: space.md }}>
      {showWhy && question.why ? (
        <View style={{ gap: space.sm }}>
          <Pressable
            onPress={() => setWhyOpen((v) => !v)}
            style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 }}
          >
            <Feather name="info" size={14} color={colors.primaryDark} />
            <Text style={{ color: colors.primaryDark, fontWeight: '600', fontSize: 13 }}>Vì sao câu này?</Text>
          </Pressable>
          {whyOpen ? (
            <Card style={{ padding: space.md }}>
              <Text style={font.small}>{question.why}</Text>
            </Card>
          ) : null}
        </View>
      ) : null}

      <H3 style={{ fontSize: 18, lineHeight: 26 }}>{question.stem}</H3>

      <View style={grid ? { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm } : { gap: space.sm }}>
        {question.options.map((o) => (
          <View key={o.id} style={grid ? { flexBasis: '47%', flexGrow: 1 } : undefined}>
            <OptionButton
              letter={grid ? undefined : o.id}
              text={o.text}
              state={stateOf(o.id)}
              tag={tagOf(o.id)}
              compact={grid}
              onPress={() => pick(o.id)}
            />
          </View>
        ))}
      </View>

      {answered ? (
        <Card style={{ gap: space.sm }}>
          <Text style={{ fontWeight: '700', color: correct ? colors.primaryDark : colors.danger, fontSize: 15 }}>
            {correct ? '✓ Chính xác' : `✕ Chưa đúng — đáp án là ${question.options.find((o) => o.id === question.correctId)?.text ?? question.correctId}`}
          </Text>
          <Text style={font.label}>GIẢI THÍCH CỦA CHUYÊN GIA</Text>
          <Body>{question.explanation}</Body>
          {!correct ? (
            <View style={{ backgroundColor: colors.surfaceMuted, borderRadius: radius.sm, padding: space.md }}>
              <Text style={font.small}>Đã thêm 1 ví dụ vào lộ trình vì bạn chọn sai — hãy xem lại mẫu số.</Text>
            </View>
          ) : null}
          <Row style={{ marginTop: space.xs }}>
            <Button title="Giải thích thêm" variant="secondary" small onPress={() => router.push({ pathname: '/tutor', params: { q: question.id, chosen: chosen ?? '' } })} />
            <SourceChip page={question.source.page} onPress={() => router.push({ pathname: '/source', params: { doc: question.source.doc, page: String(question.source.page) } })} />
            <View style={{ flex: 1 }} />
            <IconButton icon="flag" label="Báo lỗi câu này" onPress={onFlag ?? (() => router.push({ pathname: '/report', params: { q: question.id } }))} />
          </Row>
        </Card>
      ) : null}
    </View>
  );
}
