import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { FlashcardView, RatingBar } from '../../components/FlashcardView';
import { Badge, Button, H1, IconButton, Row, Screen, Small, useAsync } from '../../components/ui';
import { cardsApi } from '../../services/api';
import { colors, space } from '../../theme';

export default function ReviewCards() {
  const cards = useAsync(() => cardsApi.dueCards());
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [counts, setCounts] = useState({ again: 0, good: 0 });

  if (!cards) return <Screen><Small>Đang tải…</Small></Screen>;
  const done = idx >= cards.length;
  const card = cards[idx];
  const remaining = cards.length - idx;

  const header = (
    <Row style={{ paddingHorizontal: space.lg, paddingVertical: space.sm, justifyContent: 'space-between', backgroundColor: colors.bg }}>
      <IconButton icon="x" label="Đóng" onPress={() => router.back()} />
      <Row gap={10}>
        <Text style={{ color: colors.blue, fontWeight: '800' }}>{cards.filter((c, i) => i >= idx && c.state === 'new').length}</Text>
        <Text style={{ color: colors.orange, fontWeight: '800' }}>{cards.filter((c, i) => i >= idx && c.state === 'learning').length}</Text>
        <Text style={{ color: colors.primary, fontWeight: '800' }}>{cards.filter((c, i) => i >= idx && c.state === 'review').length}</Text>
      </Row>
      <IconButton icon="more-horizontal" label="Tuỳ chọn thẻ" onPress={() => router.push('/flashcards/browse')} />
    </Row>
  );

  if (done) {
    return (
      <Screen header={header} footer={<Button style={{ flex: 1 }} title="Về bộ thẻ" onPress={() => router.replace('/flashcards')} />}>
        <View style={{ alignItems: 'center', paddingVertical: space.xxl, gap: space.md }}>
          <Badge text="Xong phiên ôn" tone="green" />
          <H1 style={{ textAlign: 'center' }}>Đã ôn {cards.length} thẻ</H1>
          <Small style={{ textAlign: 'center' }}>
            {counts.good} thẻ nhớ tốt · {counts.again} thẻ cần học lại trong phiên sau.
          </Small>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      header={header}
      edges={['top']}
      footer={
        flipped ? (
          <RatingBar
            variant="review"
            onRate={(r) => {
              cardsApi.grade(card.id, r);
              setCounts((c) => (r === 1 ? { ...c, again: c.again + 1 } : { ...c, good: c.good + 1 }));
              setFlipped(false);
              setIdx(idx + 1);
            }}
          />
        ) : (
          <Button style={{ flex: 1 }} title={`Xem đáp án · còn ${remaining} thẻ`} onPress={() => setFlipped(true)} />
        )
      }
    >
      <FlashcardView card={card} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
    </Screen>
  );
}
